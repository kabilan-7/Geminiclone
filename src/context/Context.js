import {createContext, useState} from 'react'
import run from '../config/gemini.js'
export const context=createContext()
const ContextProvider=(props)=>{
    const [input,setInput]=useState("")
    const [recentPrompt,setRecentPrompt]=useState("")
    const [prevPrompts,setPrevPrompts]=useState([])
    const [showResults,setShowResults]=useState(false)
    const [loading,setLoading]=useState(false)
    const [resultData,setResultData]=useState("")
    const delayPara=(index,nextWord)=>{
        setTimeout(function (){
             setResultData(prev=>prev+nextWord)
        },75*index)
    }
    const newChat=()=>{
        setLoading(false)
        setShowResults(false)
    }
    const onSent= async (prompt)=>{
        setResultData("")
        setLoading(true)
        setShowResults(true)
        let response;
        if(prompt!==undefined){
            response=await run(prompt) 
            setRecentPrompt(prompt)
        }else{
            setPrevPrompts(prev=>[...prev,input])
            setRecentPrompt(input)
            response=await run(input)
        }
        
        let responsearray=response.split("**")
        let newResponse="";
        for(let i=0;i<responsearray.length;i++){
            if(i===0 || i%2!==1){
                newResponse+=responsearray[i]
            }else{
                newResponse+="<b>"+responsearray[i]+"</b>"
            }
        }
        let newResponse2=newResponse.split("*").join("</br>")
        let newResponseArray=newResponse2.split(" ");
        for(let i=0;i<newResponseArray.length;i++){
            const nextWord=newResponseArray[i]
            delayPara(i,nextWord+" ")
        }
        setLoading(false)
        setInput("")
    }
    const contextvalue={
        onSent,
        prevPrompts,
        setPrevPrompts,
        setRecentPrompt,
        recentPrompt,
        showResults,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }
    return(
        <context.Provider value={contextvalue}>
           {props.children}
        </context.Provider>
    )
}
export default ContextProvider