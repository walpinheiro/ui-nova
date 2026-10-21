import { onBeforeUnmount, ref } from 'vue'

export type AudioRecorderStatus = 'idle' | 'recording' | 'paused' | 'ready' | 'playing'

export interface UseAudioRecorderOptions {
  /** Level samples per second pushed into `levels`. */
  sampleRate?: number
  mimeType?: string
}

export function isAudioRecordingSupported() {
  return (
    typeof window !== 'undefined' &&
    typeof window.MediaRecorder !== 'undefined' &&
    Boolean(navigator.mediaDevices?.getUserMedia)
  )
}

/**
 * Microphone capture for `VAudioRecorder`: exposes `status`, `elapsed`, `duration`, `levels`
 * (0–1 amplitudes) and the recorded `blob`. Bind `status` to the component's `state`
 * (it is `idle` before the first take).
 */
export function useAudioRecorder(options: UseAudioRecorderOptions = {}) {
  const sampleRate = options.sampleRate ?? 12
  const status = ref<AudioRecorderStatus>('idle')
  const elapsed = ref(0)
  const duration = ref(0)
  const levels = ref<number[]>([])
  const blob = ref<Blob | null>(null)
  const error = ref<string | null>(null)

  let stream: MediaStream | null = null
  let recorder: MediaRecorder | null = null
  let audioContext: AudioContext | null = null
  let analyser: AnalyserNode | null = null
  let sampler: ReturnType<typeof setInterval> | undefined
  let audio: HTMLAudioElement | null = null
  let objectUrl: string | null = null
  let chunks: Blob[] = []

  function sampleLevel() {
    if (!analyser) return
    const data = new Uint8Array(analyser.fftSize)
    analyser.getByteTimeDomainData(data)
    let sum = 0
    for (const value of data) sum += ((value - 128) / 128) ** 2
    levels.value = [...levels.value, Math.min(1, Math.sqrt(sum / data.length) * 4)]
    elapsed.value += 1 / sampleRate
  }

  function startSampling() {
    stopSampling()
    sampler = setInterval(sampleLevel, 1000 / sampleRate)
  }

  function stopSampling() {
    if (sampler) clearInterval(sampler)
    sampler = undefined
  }

  function releaseInput() {
    stopSampling()
    stream?.getTracks().forEach((track) => track.stop())
    void audioContext?.close()
    stream = null
    audioContext = null
    analyser = null
  }

  async function start() {
    if (!isAudioRecordingSupported()) {
      error.value = 'Audio recording is not supported in this browser.'
      return
    }
    discard()
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Microphone permission denied.'
      return
    }
    audioContext = new AudioContext()
    analyser = audioContext.createAnalyser()
    analyser.fftSize = 512
    audioContext.createMediaStreamSource(stream).connect(analyser)

    recorder = new MediaRecorder(stream, options.mimeType ? { mimeType: options.mimeType } : undefined)
    chunks = []
    recorder.ondataavailable = (event) => {
      if (event.data.size) chunks.push(event.data)
    }
    recorder.onstop = () => {
      blob.value = new Blob(chunks, { type: recorder?.mimeType || 'audio/webm' })
      duration.value = elapsed.value
      elapsed.value = 0
      status.value = 'ready'
      releaseInput()
    }
    recorder.start()
    error.value = null
    status.value = 'recording'
    startSampling()
  }

  function pause() {
    if (status.value !== 'recording' || !recorder) return
    recorder.pause()
    stopSampling()
    status.value = 'paused'
  }

  function resume() {
    if (status.value !== 'paused' || !recorder) return
    recorder.resume()
    startSampling()
    status.value = 'recording'
  }

  /** Finishes the take; `blob` is set and status becomes `ready`. */
  function save() {
    if (recorder && (status.value === 'recording' || status.value === 'paused')) recorder.stop()
  }

  function play() {
    if (!blob.value) return
    if (!audio) {
      objectUrl = URL.createObjectURL(blob.value)
      audio = new Audio(objectUrl)
      audio.ontimeupdate = () => {
        elapsed.value = audio?.currentTime ?? 0
      }
      audio.onended = () => {
        elapsed.value = 0
        status.value = 'ready'
      }
    }
    void audio.play()
    status.value = 'playing'
  }

  function stop() {
    audio?.pause()
    if (status.value === 'playing') status.value = 'ready'
  }

  function discard() {
    if (recorder && recorder.state !== 'inactive') {
      recorder.onstop = null
      recorder.stop()
    }
    releaseInput()
    audio?.pause()
    if (objectUrl) URL.revokeObjectURL(objectUrl)
    recorder = null
    audio = null
    objectUrl = null
    chunks = []
    blob.value = null
    levels.value = []
    elapsed.value = 0
    duration.value = 0
    status.value = 'idle'
  }

  onBeforeUnmount(discard)

  return { status, elapsed, duration, levels, blob, error, start, pause, resume, save, play, stop, discard }
}
