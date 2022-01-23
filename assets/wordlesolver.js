import {answerarray} from './wordleanswers.js'
import {guessarray} from './wordleguesses.js'

var guesses = [...guessarray]
var answers = [...answerarray]

var greens = ['G','G','G','G','G']
var outputBox = document.getElementById('outputBox')

document.getElementById('getWordleButton').addEventListener('click', ()=>{
    var truth = document.getElementById('truthInput').value.toLowerCase()
    var claim = document.getElementById('claimInput').value.toLowerCase()
    if(!answers.includes(truth)) {
        alert('Truth not contained in answer list. Pick a new truth')
        return
    }
    if(!guesses.includes(claim)) {
        alert('Claim not contained in answer list. Pick a new claim')
        return
    }
    getWordle(truth, claim)
})

document.getElementById('randomTruth').addEventListener('click', ()=>{
    let randomIndex = Math.floor(Math.random() * answers.length)

    document.getElementById('truthInput').value = answers[randomIndex]
})

var getWordle = (truth, claim) => {
    let currentResult = getCurrentResult(truth, claim)

    if(JSON.stringify(currentResult.currentResult) == JSON.stringify(greens)) {
        outputBox.innerHTML += 'Wordle Solved'
        return
    }

    removeAnswers(currentResult)
    outputBox.innerHTML += (JSON.stringify(currentResult.currentResult) + ' Possible answers remaining: ' + answers.length + '<br>')

    if(answers.length < 20) {
        document.getElementById('answersBox').innerHTML = answers
    }
    return currentResult
}

var getCurrentResult = (truth, claim) => {

    let resultObject = {
        truth: truth,
        tempTruth: truth,
        claim: claim,
        currentResult: ['B', 'B', 'B', 'B', 'B'],
        currentResultCounts: [0,0,0,0,0]
    }

    for(let i=0;i<5;i++) {
        resultObject.currentResultCounts[i] = countLetters(claim[i], claim)
    }

    let currentResult = getGreens(resultObject)
    currentResult = getYellows(currentResult)

    return currentResult
}

var getGreens = resultObject => {

    for(let i=0;i<resultObject.claim.length;i++) {
        if(resultObject.claim[i] == resultObject.truth[i]) {
            resultObject.currentResult[i] = 'G'
            resultObject.tempTruth = resultObject.tempTruth.replace(resultObject.claim[i], '')
        }
    }
    return resultObject
}

var getYellows = currentResult => {
    for(let i=0;i<currentResult.claim.length;i++) {
        for(let j=0;j<currentResult.tempTruth.length;j++) {
            if(currentResult.claim[i] == currentResult.tempTruth[j]) {
                if(currentResult.currentResult[i] != 'G') {
                    currentResult.currentResult[i] = 'Y'
                    currentResult.tempTruth = currentResult.tempTruth.replace(currentResult.claim[i], '')
                    break
                }
            }
        }
    }

    return currentResult
}

var removeAnswers = currentResult => {

    let tempAnswers = [...answers]
    for(let i=0;i<currentResult.currentResult.length;i++) {
        if(currentResult.currentResult[i] == 'B') {
            let dupeFlag = false
            if(currentResult.currentResultCounts[i] != 1) {
                for(let k=0;k<currentResult.currentResult.length;k++) {
                    if(currentResult.currentResult[k] == 'G' || currentResult.currentResult[k] == 'Y') {
                        if(currentResult.claim[k] == currentResult.claim[i]) {
                            dupeFlag = true
                        }
                    }
                }
            }
            if(dupeFlag) {
                continue
            }
            for(let j=0;j<answers.length;j++) {
                if(answers[j].includes(currentResult.claim[i])) {
                    if(tempAnswers.indexOf(answers[j]) != -1) {
                        tempAnswers.splice(tempAnswers.indexOf(answers[j]), 1)
                    }
                }
            }
            answers = [...tempAnswers]
            continue
        }
        
        if(currentResult.currentResult[i] == 'Y') {
            for(let j=0;j<answers.length;j++) {
                if(!answers[j].includes(currentResult.claim[i])) {
                    if(tempAnswers.indexOf(answers[j]) != -1) {
                        tempAnswers.splice(tempAnswers.indexOf(answers[j]), 1)
                    }
                }
            }
            answers = [...tempAnswers]
            continue
        }
        if(currentResult.currentResult[i] == 'G') {
            for(let j=0;j<answers.length;j++) {
                if(answers[j][i] != currentResult.claim[i]) {
                    if(tempAnswers.indexOf(answers[j]) != -1) {
                        tempAnswers.splice(tempAnswers.indexOf(answers[j]), 1)
                    }
                }
            }
            answers = [...tempAnswers]
            continue
        }
    }
}

var countLetters = (letter, word) => {
    let count = 0
    for(let i=0;i<word.length;i++) {
        if(word[i] == letter) {
            count++
        }
    }

    return count
}

var getOneResult = (answer, guess) => {
        console.log(answer + ' ' + guess)
        let currentResult = getWordle(answer, guess)
        let pair = [guess, answers.length]
        console.log(pair)
}