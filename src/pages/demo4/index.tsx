import { View, Text, Input, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect, useRef } from 'react'
import './index.scss'

type Phase = 'idle' | 'exercise' | 'rest'

type RunSnapshot = {
  name: string
  exerciseSec: number
  restSec: number
  totalSets: number
}

function parsePositiveInt(raw: string): number | null {
  const n = parseInt(String(raw).trim(), 10)
  if (!Number.isFinite(n) || n < 1) return null
  return n
}

function formatCountdown(sec: number): string {
  const s = Math.max(0, Math.floor(sec))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`
}

export default function Demo4Index() {
  const [exerciseName, setExerciseName] = useState('')
  const [exerciseTimeInput, setExerciseTimeInput] = useState('60')
  const [restTimeInput, setRestTimeInput] = useState('30')
  const [setsInput, setSetsInput] = useState('3')

  const [isRunning, setIsRunning] = useState(false)
  const [phase, setPhase] = useState<Phase>('idle')
  const [currentSet, setCurrentSet] = useState(1)
  const [remain, setRemain] = useState(0)

  const snapshotRef = useRef<RunSnapshot>({
    name: '运动',
    exerciseSec: 60,
    restSec: 30,
    totalSets: 3,
  })

  useEffect(() => {
    if (!isRunning) return
    const id = setInterval(() => {
      setRemain((r) => (r <= 1 ? 0 : r - 1))
    }, 1000)
    return () => clearInterval(id)
  }, [isRunning])

  useEffect(() => {
    if (!isRunning || remain !== 0) return
    const snap = snapshotRef.current

    if (phase === 'exercise') {
      if (currentSet < snap.totalSets) {
        setPhase('rest')
        setRemain(snap.restSec)
        return
      }
      setIsRunning(false)
      setPhase('idle')
      setCurrentSet(1)
      Taro.showModal({
        title: '训练完成',
        content: `「${snap.name}」共 ${snap.totalSets} 组已全部完成，可以休息了。`,
        showCancel: false,
      })
      return
    }

    if (phase === 'rest') {
      setPhase('exercise')
      setCurrentSet((c) => c + 1)
      setRemain(snap.exerciseSec)
    }
  }, [remain, isRunning, phase, currentSet])

  function handleStart() {
    const ex = parsePositiveInt(exerciseTimeInput)
    const rest = parsePositiveInt(restTimeInput)
    const sets = parsePositiveInt(setsInput)
    if (ex === null || rest === null || sets === null) {
      Taro.showToast({ title: '时间、组数请填写正整数', icon: 'none' })
      return
    }

    const name = exerciseName.trim() || '运动'
    snapshotRef.current = {
      name,
      exerciseSec: ex,
      restSec: rest,
      totalSets: sets,
    }

    setCurrentSet(1)
    setPhase('exercise')
    setRemain(ex)
    setIsRunning(true)
  }

  function handleStop() {
    setIsRunning(false)
    setPhase('idle')
    setRemain(0)
    setCurrentSet(1)
  }

  const inWorkout = isRunning && phase !== 'idle'
  const snap = snapshotRef.current
  const phaseLabel =
    phase === 'exercise' ? '运动中' : phase === 'rest' ? '休息' : ''

  return (
    <View className='demo4'>
      {!inWorkout ? (
        <View className='demo4__panel'>
          <Text className='demo4__title'>训练配置</Text>

          <View className='demo4__field'>
            <Text className='demo4__label'>运动名称</Text>
            <Input
              className='demo4__input'
              type='text'
              placeholder='例如：深蹲（可留空）'
              value={exerciseName}
              onInput={(e) => setExerciseName(e.detail.value)}
            />
          </View>

          <View className='demo4__field'>
            <Text className='demo4__label'>每组时长（秒）</Text>
            <Input
              className='demo4__input'
              type='number'
              placeholder='正整数'
              value={exerciseTimeInput}
              onInput={(e) => setExerciseTimeInput(e.detail.value)}
            />
          </View>

          <View className='demo4__field'>
            <Text className='demo4__label'>组间休息（秒）</Text>
            <Input
              className='demo4__input'
              type='number'
              placeholder='正整数'
              value={restTimeInput}
              onInput={(e) => setRestTimeInput(e.detail.value)}
            />
          </View>

          <View className='demo4__field'>
            <Text className='demo4__label'>组数</Text>
            <Input
              className='demo4__input'
              type='number'
              placeholder='正整数'
              value={setsInput}
              onInput={(e) => setSetsInput(e.detail.value)}
            />
          </View>

          <Button className='demo4__btn demo4__btn--primary' onClick={handleStart}>
            开始
          </Button>
        </View>
      ) : (
        <View className='demo4__panel demo4__panel--run'>
          <Text className='demo4__run-name'>{snap.name}</Text>
          <Text className='demo4__run-phase'>{phaseLabel}</Text>
          <Text className='demo4__run-set'>
            第 {currentSet} / {snap.totalSets} 组
          </Text>
          <Text className='demo4__run-countdown'>{formatCountdown(remain)}</Text>
          <Button className='demo4__btn demo4__btn--ghost' onClick={handleStop}>
            停止
          </Button>
        </View>
      )}
    </View>
  )
}
