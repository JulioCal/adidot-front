import React, { useState } from 'react';

const CredentialContext = React.createContext({
    
   });

   export function LoginContextProvider({children}){
    const [logData ,setLog] = useState({
        login:'', key:'', gerencia:'', cedula:'', isLogged: false// should be false
    })
    return <CredentialContext.Provider value={{logData, setLog}}>
        {children}
    </CredentialContext.Provider>
   }
   export default CredentialContext