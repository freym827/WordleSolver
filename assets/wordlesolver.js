import {answerarray} from './wordleanswers.js'
import {guessarray} from './wordleguesses.js'

var guesses = [...guessarray]
var answers = [...answerarray]

var pickTruthGuesses = [...guessarray]
var pickTruthAnswers = [...answerarray]

var findTruthGuesses = [...guessarray]
var findTruthAnswers = [...answerarray]

// var answers = [
//     'allow','alloy','colon','color','dolly','folly', 'ducky','steel','lunch','lists','plumb','storm','japan','coral','beers'
// ]

// var pickTruthAnswers = [
//     'allow','alloy','colon','color','dolly','folly', 'ducky','steel','lunch','lists','plumb','storm','japan','coral','beers'
// ]

// var findTruthAnswers = [
//     'allow','alloy','colon','color','dolly','folly', 'ducky','steel','lunch','lists','plumb','storm','japan','coral','beers'
// ]

var greens = ['G','G','G','G','G']
var outputBox = document.getElementById('outputBox')

document.getElementById('calculateResults').addEventListener('click', ()=>{
    var claim = document.getElementById('claimInputResult').value.toLowerCase()
    var result = document.getElementById('resultInputResult').value.toUpperCase()
    if(!guesses.includes(claim)) {
        alert('Claim not contained in guess list. Pick a new claim')
        return
    }
    if(result.length != 5) {
        alert('Invalid result. Enter different result')
        return
    }
    document.getElementById('claimInputResult').value = ''
    document.getElementById('resultInputResult').value = ''
    document.getElementById('claimSpan').innerHTML += claim + ': ' + result + ', '

    var resultObject = getResultObject(claim, result)

    findTruthAnswers = removeAnswers(findTruthAnswers, resultObject)

    document.getElementById('possibilitySpan').innerHTML = findTruthAnswers.length
    if(findTruthAnswers.length < 20) {
        document.getElementById('possibilityBox').innerHTML = findTruthAnswers
    }
})

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
    document.getElementById('truthClaimSpan').innerHTML += claim + ', '
    getWordle(truth, claim)
})

document.getElementById('randomTruth').addEventListener('click', ()=>{
    let randomIndex = Math.floor(Math.random() * answers.length)

    document.getElementById('truthInput').value = answers[randomIndex]
})

document.getElementById('randomClaim').addEventListener('click', ()=>{
    let randomIndex = Math.floor(Math.random() * guesses.length)

    document.getElementById('claimInput').value = guesses[randomIndex]
})

document.getElementById('findTruthRandomClaim').addEventListener('click', ()=>{
    let randomIndex = Math.floor(Math.random() * guesses.length)

    document.getElementById('claimInputResult').value = guesses[randomIndex]
})

document.getElementById('resetPickTruth').addEventListener('click', ()=>{
    document.getElementById('truthInput').value = ''
    document.getElementById('claimInput').value = ''
    outputBox.innerHTML = ''
    document.getElementById('answersBox').innerHTML = ''
    document.getElementById('truthClaimSpan').innerHTML  = ''
    pickTruthGuesses = [...guessarray]
    pickTruthAnswers = [...answerarray]
})

document.getElementById('resetFindTruth').addEventListener('click', ()=>{
    document.getElementById('resultInputResult').value = ''
    document.getElementById('claimInputResult').value = ''
    document.getElementById('possibilityBox').innerHTML = ''
    document.getElementById('claimSpan').innerHTML = ''
    document.getElementById('possibilitySpan').innerHTML = ''
    findTruthGuesses = [...guessarray]
    findTruthAnswers = [...answerarray]
})

var getWordle = (truth, claim) => {
    let currentResult = getCurrentResult(truth, claim)

    pickTruthAnswers = removeAnswers(pickTruthAnswers, currentResult)
    outputBox.innerHTML += (JSON.stringify(currentResult.currentResult) + ' Possible answers remaining: ' + pickTruthAnswers.length + '<br>')

    if(pickTruthAnswers.length < 20) {
        document.getElementById('answersBox').innerHTML = pickTruthAnswers
    }
    if(JSON.stringify(currentResult.currentResult) == JSON.stringify(greens)) {
        outputBox.innerHTML += 'Wordle Solved'
        return
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

    resultObject = countBlackLetters(resultObject)

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

var removeAnswers = (ans, currentResult) => {
    let tempAnswers = [...ans]
    for(let i=0;i<currentResult.currentResult.length;i++) {
        if(currentResult.currentResult[i] == 'B') {
            for(let j=0;j<ans.length;j++) {
                let answerLetterCount = countLetters(currentResult.claim[i], ans[j])
                if(answerLetterCount >= currentResult.currentResultCounts[i]) {
                     if(tempAnswers.indexOf(ans[j]) != -1) {
                         tempAnswers.splice(tempAnswers.indexOf(ans[j]), 1)
                     }
                }
            }
            ans = [...tempAnswers]
            continue
        }

        // if(currentResult.currentResult[i] == 'B') {
        //     let dupeFlag = false
        //     if(currentResult.currentResultCounts[i] != 1) {
        //         for(let k=0;k<currentResult.currentResult.length;k++) {
        //             if(currentResult.currentResult[k] == 'G' || currentResult.currentResult[k] == 'Y') {
        //                 if(currentResult.claim[k] == currentResult.claim[i]) {
        //                     dupeFlag = true
        //                 }
        //             }
        //         }
        //     }
        //     if(dupeFlag) {
        //         continue
        //     }
        //     for(let j=0;j<ans.length;j++) {
        //         if(ans[j].includes(currentResult.claim[i])) {
        //             if(tempAnswers.indexOf(ans[j]) != -1) {
        //                 tempAnswers.splice(tempAnswers.indexOf(ans[j]), 1)
        //             }
        //         }
        //     }
        //     ans = [...tempAnswers]
        //     continue
        // }
        
        if(currentResult.currentResult[i] == 'Y') {
            for(let j=0;j<ans.length;j++) {
                if(!ans[j].includes(currentResult.claim[i])) {
                    if(tempAnswers.indexOf(ans[j]) != -1) {
                        tempAnswers.splice(tempAnswers.indexOf(ans[j]), 1)
                    }
                }
                if(ans[j][i] == currentResult.claim[i]) {
                    if(tempAnswers.indexOf(ans[j]) != -1) {
                        tempAnswers.splice(tempAnswers.indexOf(ans[j]), 1)
                    }
                }
            }
            ans = [...tempAnswers]
            continue
        }
        if(currentResult.currentResult[i] == 'G') {
            for(let j=0;j<ans.length;j++) {
                if(ans[j][i] != currentResult.claim[i]) {
                    if(tempAnswers.indexOf(ans[j]) != -1) {
                        tempAnswers.splice(tempAnswers.indexOf(ans[j]), 1)
                    }
                }
            }
            ans = [...tempAnswers]
            continue
        }
    }
    return ans
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

var getResultObject = (claim, result) => {

    let resultArray = []
    for(let i=0;i<result.length;i++) {
        resultArray.push(result[i])
    }

    let resultObject = {
        truth: null,
        tempTruth: null,
        claim: claim,
        currentResult: resultArray,
        currentResultCounts: [0,0,0,0,0]
    }

    resultObject = countBlackLetters(resultObject)

    return resultObject
}

var countBlackLetters = (resultObject) => {
    for(let i=0;i<resultObject.claim.length;i++) {
        let count = 0
        for(let j=0;j<resultObject.claim.length;j++) {
            if(resultObject.claim[i] == resultObject.claim[j]) {
                count++
            }
        }
        resultObject.currentResultCounts[i] = count
    }
    return resultObject
}

