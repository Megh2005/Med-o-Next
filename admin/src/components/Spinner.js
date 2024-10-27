import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function Spinner(){
    return(
        <div className="animate-ping w-16 h-16 m-8 rounded-full bg-sky-600"><FontAwesomeIcon icon={faSpinner} spinPulse /></div> 
    )
         
}