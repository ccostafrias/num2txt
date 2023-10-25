import React, { useState, useEffect } from "react"
import { AiOutlineCheck } from "react-icons/ai"


export default function App() {
    const [numInput, setnumInput] = useState(28)

    const [copyActive, setCopyActive] = useState(false)
    const [numTrans, setNumTrans] = useState('Vinte e oito.')

    const cardinalNames = ['', 'mil', 'milhão', 'bilhão', 'trilhão', 'quadrilhão', 'quintilhão', 'sextilhão', 'septilhão', 'octilhão', 'nonilhão', 'decilhão', 'undecilhão', 'duodecilhão', 'tredecilhão', 'quattuordecilhão', 'quindecilhão', 'sexdecilhão', 'septendecilhão', 'octodecilhão', 'novendecilhão', 'vigintilhão']
    const cardinalCount = {1: 'um', 2: 'dois', 3: 'três', 4: 'quatro', 5: 'cinco', 6: 'seis', 7: 'sete', 8: 'oito', 9: 'nove', 10: 'dez', 11: 'onze', 12: 'doze', 13: 'treze', 14: 'quatorze', 15: 'quinze', 16: 'dezesseis', 17: 'dezessete', 18: 'dezoito', 19: 'dezenove', 20: 'vinte', 30: 'trinta', 40: 'quarenta', 50: 'cinquenta', 60: 'sessenta', 70: 'setenta', 80: 'oitenta', 90: 'noventa', 200: 'duzentos', 300: 'trezentos', 400: 'quatrocentos', 500: 'quinhentos', 600: 'seiscentos', 700: 'setecentos', 800: 'oitocentos', 900: 'novecentos'}

    function handleSubmit(e) {
        e.preventDefault()
    }

    function addToString(str, add) {
        if (!add) return str
        return `${str} ${add}`

    }

    const chunkArray = (arr, size) =>
        arr.length > size
            ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)]
            : [arr];

    const getUnits = (n) => (n%100) - (n%100 - ((n%100) % 10))
    const getDozens = (n) => (n%100) - (n%100 % 10)
    const getHundreds = (n) => n - (n%100)

    function handleChange(e) {
        const { value } = e.target
        // const filtered = Number(value.replace(/\D/g, ''))
        // const split = chunkArray(filtered.split("").reverse(), 3).reverse().map(i => i.reverse())
        const filtered = value.replace(/\D/g, '').replace(/^0+/, '')
        const locale = chunkArray(filtered.split("").reverse(), 3).reverse().map(i => i.reverse().join('')).join('.')
        const split = locale.split('.')
        let numberWritten = ''
        for (let i in split) {
            const ordem = split.length - i - 1
            const actualNumber = Number(split[i])
            const hundreds = getHundreds(actualNumber)
            const dozens = getDozens(actualNumber)
            const units = getUnits(actualNumber)

            if (split.length === 1 && units === 0) {
                numberWritten = 'zero'
            } else {
                if (hundreds) {
                    if (hundreds === 100) {
                        if (dozens > 0) {
                            numberWritten = addToString(numberWritten, 'cento')
                        } else {
                            numberWritten = addToString(numberWritten, 'cem')
                        }
                    } else {
                        numberWritten = addToString(numberWritten, cardinalCount[hundreds])
                    }
                    if (dozens) numberWritten = addToString(numberWritten, 'e')
                }
    
                if (dozens) {
                    if (dozens + units < 20 && dozens + units > 10) {
                        numberWritten = addToString(numberWritten, cardinalCount[dozens + units])
                    } else {
                        numberWritten = addToString(numberWritten, cardinalCount[dozens])
                    }
                    if (units && dozens !== 10) numberWritten = addToString(numberWritten, 'e')
                }
    
                if (units && dozens !== 10) {
                    numberWritten = addToString(numberWritten, cardinalCount[units])
                }
                
                if (actualNumber !== 0) {
                    if (actualNumber !== 1) {
                        numberWritten = addToString(numberWritten, cardinalNames[ordem].replace('ão', 'ões'))
                    } else {
                        numberWritten = addToString(numberWritten, cardinalNames[ordem])
                    }
                }
    
                if (ordem === 1 && getUnits(split[split.length-1]) !== 0) numberWritten = addToString(numberWritten, 'e')
            }

        }
        numberWritten = numberWritten.trim()
        const firstLetter = numberWritten.charAt(0).toUpperCase()
        const formated = `${firstLetter}${numberWritten.slice(1)}.`

        locale ? setnumInput(locale) : setnumInput(0)
        setNumTrans(formated)
    }

    function copyNum() {
        setCopyActive(true)
        navigator.clipboard.writeText(numTrans)
    }

    useEffect(() => {
        const copyTimeout = setTimeout(() => {
            setCopyActive(false)
        }, 2000);

        return () => clearTimeout(copyTimeout)
    }, [copyActive])

    return (
        <>
            <header>
                <h1>Num2Txt</h1>
            </header>
            <main>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        // placeholder="ex: 117"
                        autoComplete="off"
                        className="num-input"
                        name="number"
                        value={numInput}
                        onChange={handleChange}
                    />
                    <span className="num-trans">{numTrans}</span>
                    <input type="button" value="Copiar" className="num-bttn" onClick={copyNum}/>
                </form>
            </main>
            <footer className={`copy-popup ${copyActive ? 'active' : ''}`}>
                <span>Copiado</span>
                <AiOutlineCheck className="ai-outline-check"/>
                <input type="text" name="copy" className="empty" />
            </footer>
        </>
       
    )
}