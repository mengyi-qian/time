/*
 * @Date: 2020-02-11 14:36:39
 * @LastEditors: lifangdi
 * @LastEditTime: 2020-04-10 22:14:52
 */
const CAPTIONS = [
  'Today I forgot about time. Everything was static, with only the water surface in the glass shaking slightly.',
  'The movement of an object reminds me of the existence of time. When I see a water drops, I see time.',
  'Time is sometimes fast, sometimes slow, and the speed is how I measure my time passing.',
  'In my dream I was running, as if chased by time. If you want to stop time, please stop typing.'
]

const VIDEOS_SRC = [
  './videos/video1.mp4',
  './videos/video2.mp4',
  './videos/video3.mp4',
  './videos/video4.mp4'
]

const subTitle = document.getElementById('subtitle')
const startTip = document.getElementById('start-tip')
const start = document.getElementById('start')
const next = document.getElementById('next')
const nextTip = document.getElementById('next-tip')
const nextTipWord = document.getElementById('next-tip-word')
const myVideo = document.getElementById('my-video')

// js原生方法获取「文本框」
const input = document.getElementById('input')

const game_tip = document.getElementById('game-tip')

const wrong = document.getElementById('wrong-box')

const sentences = document.getElementsByClassName('sentences')


let curIndex = 0
let curCaption = CAPTIONS[curIndex]
let curVideoSrc = VIDEOS_SRC[curIndex]
sentences[0].innerHTML = curCaption
myVideo.innerHTML = '<source src="' + curVideoSrc + '" type="video/mp4" />'

const randomLine = () => {
  let line_height = getRandomNum(55, 70);
  wrong.innerHTML = ''
  for(let i = 0; i < line_height; i++) {
    let wrong_line = document.createElement('li');
    wrong.appendChild(wrong_line);
    wrong_line.style.height = getRandomNum(3, line_height) + 'px';
    wrong_line.className = 'wrong-line';
  }
}


// 通过id实例化videojs对象
const myPlayer = videojs('my-video')

const inputStart = document.createElement('div');
startTip.appendChild(inputStart);
inputStart.className = 'start-sentences'
// 绑定「开始输入框」输入事件
start.focus()
start.oninput = (e) => {
  const letter = document.getElementsByClassName('letter')
  const START_TIP = 'start'
  const startTipArr = START_TIP.split('')
  if(e.data) {
    if(START_TIP.includes(start.value) && startTipArr[start.value.length - 1] === e.data) {
      inputLetter('letter letter-right', e.data, inputStart);
      if(start.value.length === 5) {
        myPlayer.currentTime(0)
        start.classList.add('remove-start')
        input.focus();
        sentences[0].className = 'sentences'
        inputStart.className = 'hide'
        startTip.className = 'hide'
      }
    }
    else {
      inputLetter('letter letter-wrong', e.data, inputStart);
    }
  } else {
    inputStart.removeChild(letter[letter.length-1])
  }
}

const inputNext = document.createElement('div');
nextTip.appendChild(inputNext);
inputNext.className = 'hide'
nextTip.className = 'hide'
const nextVideo = () => {
  inputNext.className = 'next-sentences'
  nextTipWord.className = 'next-sentences'
  nextTip.className = 'next-sentences'
  sentences[1].innerHTML = ''
  sentences[0].innerHTML = ''
  myVideo.innerHTML = ''

  next.oninput = (e) => {
    const letter = document.getElementsByClassName('letter')
    const NEXT_TIP = 'next'
    const nextTipArr = NEXT_TIP.split('')
    input.value = ''
    if(e.data) {
      if(NEXT_TIP.includes(next.value) && nextTipArr[next.value.length - 1] === e.data) {
        inputLetter('letter letter-right', e.data, inputNext);
        if(next.value.length === 4) {
          myPlayer.currentTime(0)
          next.classList.add('remove-next')
          sentences[0].className = 'sentences'
          inputNext.className = 'hide'
          nextTip.className = 'hide'
          curIndex++
          curCaption = CAPTIONS[curIndex]
          curVideoSrc = VIDEOS_SRC[curIndex]
          sentences[0].innerHTML = curCaption
          myPlayer.src(curVideoSrc)
          input.focus()
          next.value = ''
          inputNext.innerHTML = ''
        }
      }
      else {
        inputLetter('letter letter-wrong', e.data, inputNext);
      }
    } else {
      inputNext.removeChild(letter[letter.length-1])
    }
  }
}

// 控制输入每个字符的播放时间
const pre = () => {
  let span = myPlayer.duration() * 1000 / curCaption.length
  myPlayer.play()
  input.setAttribute('disabled', 'disabled')
  input.value !== curCaption && setTimeout(() => {
    input.removeAttribute('disabled')
    input.focus()
    myPlayer.pause()
  }, span)
  input.value === curCaption && input.blur()
  input.removeAttribute('disabled')
}

const back = () => {
  const curTime = myPlayer.currentTime()
  myPlayer.currentTime(curTime - myPlayer.duration() / curCaption.length)
}

const inputLetter = (className, inner, inputSentencesName) => {
  const letter = document.createElement('span');
  letter.className = className
  inputSentencesName.appendChild(letter);
  letter.innerHTML = inner
}

let videoLength
myPlayer.on('loadedmetadata',() => {
  videoLength = Math.floor(myPlayer.duration())
})

function getRandomNum(min, max) {
  return (Math.random() * (max - min) + min).toFixed(3);
}

const inputSentences1 = document.createElement('div');
subTitle.appendChild(inputSentences1);
inputSentences1.className = 'sentences'

// 文本框输入事件
// 每次键盘输入事件，获取文本框的值，并进判断逻辑
let n = 0   // 标志变量n
let lastCorrect = 0
input.oninput = (e) => {
  let value = input.value
  let caption_arr = curCaption.split('')
  const letter = document.getElementsByClassName('letter')

  // 判断是否按del键
  if(e.data) {
    // 比对每个字母是否正确的逻辑
    if(curCaption.includes(value) && caption_arr[value.length - 1] === e.data) {
      wrong.style.display = 'none';
      n++
      pre(n)
      inputLetter('letter letter-right', e.data, inputSentences1);
      lastCorrect = myPlayer.currentTime()

      // 成功结束逻辑
      if(value.length === curCaption.length) {
        input.blur()
        if(curCaption === curCaption[CAPTIONS.length - 1]) {
          game_tip.classList.remove('display-end')
          game_tip.classList.add('show-end')
        } else {
          // input.value = ''
          input.blur()
          start.blur()
          next.focus()
          nextVideo()
        }
      }
    } else {
      randomLine()
      myPlayer.pause()
      inputLetter('letter letter-wrong', e.data, inputSentences1);
      myPlayer.currentTime(getRandomNum(0.5, videoLength))
      wrong.style.display = 'block';
    }
  } else if (n > value.length) {
    // 删除到正确的字母回退视频逻辑
    inputSentences1.removeChild(letter[letter.length-1])
    back(n)
    n--
  } else {
    inputSentences1.removeChild(letter[letter.length-1])
    myPlayer.currentTime(lastCorrect)
    if (curCaption.includes(value)) {
      wrong.style.display = 'none';
    }
  }
}
