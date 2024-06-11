import React from 'react'

function Alert(props) {
    // alert=props.alert
    const errorClass=alert?.type==='danger'?'bg-red-100 border-l-4 border-red-700 text-red-700 px-4 py-2':'bg-green-200 border-l-4 border-green-700 text-green-700 px-4 py-2'
  const capatilize = (word) => {
    if (word === "danger")
      word = "error"
    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1)
  }

  return (
    <div className={props.alert?'h-7 w-full absolute top-0 z-50':''}>
      {props.alert && <div className={errorClass} role="alert">
      <p className="font-bold">{capatilize(props.alert.type)} : {capatilize(props.alert.msg)}</p>
    </div>
        }
    </div >
  )
}

export default Alert
