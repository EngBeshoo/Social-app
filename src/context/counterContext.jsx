import { createContext, useState } from "react";

export const CounterContext = createContext()

export function CounterContextProvider({children}){
    let [counter , setCounter] = useState(0)
    return <CounterContext.Provider value={{counter ,setCounter}}>
{children}
    </CounterContext.Provider>
}