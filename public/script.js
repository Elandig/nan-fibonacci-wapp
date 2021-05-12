// MIT License. Copyright (c) 2021 Elandig
'use strict'
const container = document.getElementById('app')

const fetchData = async (url) => {
  const req = await fetch(url)
  if (!req.ok)
    window.location.reload()
  const text = await req.text()
  return text
}

const App = () => {
  // Initial instances state template
  const initState = { id: 0, enabled: true }

  const [instances, updateInstances] = React.useState([initState])

  // Instance state reducer
  const handleInstanceUpdate = (action, payload) => {
    switch (action) {
      case 'create':
        {
          let temp = { ...initState }
          temp.id = instances[instances.length - 1].id + 1
          updateInstances([...instances, temp])
        }
        break
      case 'delete':
        {
          let temp = [...instances]
          temp[payload.id].enabled = false
          updateInstances(temp)
          fetchData(`/delete/${payload.id}`)
        }
    }
  }

  // Initialization
  React.useEffect(() => {
    //for ()
    //handleInstanceUpdate('create')
  }, [])
  return (
    <>
      {instances.map((instance) =>
        !instance.enabled ? '' :
          <Instance
            key={instance.id}
            id={instance.id}
            onExit={() => handleInstanceUpdate('delete', { id: instance.id })} />
      )}
      <NewFibo onClick={() => handleInstanceUpdate('create')} />
    </>
  )
}

/*
 * Main instance
 */
const Instance = (props) => {
  const outputRef = React.useRef(null)
  const [outputValue, changeOutputValue] = React.useState('Fibonacci Sequence')
  const [genFiboValue, changeGenFiboValue] = React.useState('')
  const [isFiboValue, changeIsFiboValue] = React.useState('')
  const [isFiboState, changeIsFiboState] = React.useState('')
  const [contextView, updateContextView] = React.useState(false)

  React.useEffect(() => {
    outputRef.current.scrollLeft = outputRef.current.scrollWidth
  })

  React.useEffect(() => {
    const buttonStateTimeout = setTimeout(() => {
      changeIsFiboState('')
    }, 3000)
    return () => {
      clearTimeout(buttonStateTimeout);
    }
  }, [isFiboState])

  const getFibo = () => {
    fetchData(`/get/${props.id}`).then((resp) => {
      changeOutputValue(resp)
    })
  }

  const genFibo = () => {
    if (genFiboValue === '' || !/^[0-9]+$/.test(genFiboValue) || genFiboValue <= "0" || genFiboValue > "50000") {
      alert('Please fill in the GenFibo field properly')
    } else {
      fetchData(`/generate/${genFiboValue}`).then((resp) => {
        changeOutputValue(resp)
      })
    }
  }
  const isFibo = () => {
    if (isFiboValue === '' || !/^[0-9]+$/.test(isFiboValue) || isFiboValue <= "0") {
      alert('Please fill in the isFibo field properly')
    } else {
      fetchData(`/isfibo/${isFiboValue}`).then((resp) => {
        if (resp === 'true') {
          changeIsFiboState('btn-green')
        } else {
          changeIsFiboState('btn-red')
        }
      })
    }
  }

  const resetValues = (id) => {
    changeIsFiboValue('')
    changeGenFiboValue('')
    changeOutputValue('Fibonacci Sequence')
    fetchData(`/reset/${id}`)
  }

  const genFiboInput = (event) => {
    let field = (event.target.validity.valid && event.target.value[0] !== '0') ? event.target.value : genFiboValue
    if (field > 50000)
      field = '50000'
    changeGenFiboValue(field)
  }

  const isFiboInput = (event) => {
    let field = (event.target.validity.valid && event.target.value.length < 1000) ? event.target.value : isFiboValue
    changeIsFiboValue(field)
  }

  return (
    <>
      {contextView ? <div className="overlay"></div> : ''}
      <Panel type={`instance ${contextView ? 'context-view' : ''} ${props.id === 0 ? 'panel-first' : ''}`}>
        {props.id === 0 || contextView ? '' : <CloseButton onClick={props.onExit} />}
        <div ref={outputRef} className="output">{outputValue}</div>

        <div className="instance-left">
          <div>
            <Button onClick={genFibo} text="GenFibo" />
            <Input value={genFiboValue} onChange={genFiboInput} type="instance-left-input" text="Index" />
          </div>
          <Button onClick={getFibo} text="GetFibo" />
          <div>
            <Button type={isFiboState} onClick={isFibo} text="CheckFibo" />
            <Input value={isFiboValue} onChange={isFiboInput} type="instance-left-input" text="Your sequence" />
          </div>
        </div>

        <div className="instance-right">
          <Button onClick={() => resetValues(props.id)} text="Reset" />
          <Button onClick={() => updateContextView(!contextView)} text={contextView ? 'Close' : 'ContextView'} />
        </div>

      </Panel>
    </>
  )
}

/*
 * Component for Instance creation
 */
const NewFibo = (props) => {
  return (
    <Panel type="panel-last">
      <Button onClick={props.onClick} text="NewFibo" />
    </Panel>
  )
}

/*
 * Base panel
 */
const Panel = (props) => {
  const type = props.type ? props.type : ''
  return (
    <div className={`panel ${type}`}>
      {props.children}
    </div>
  )
}

/*
 * Base button
 */
const Button = (props) => {
  const type = props.type ? props.type : ''
  return (
    <button className={`btn ${type}`} onClick={props.onClick} type="button">{props.text}</button>
  )
}

/*
 * Base input field
 */
const Input = (props) => {
  const type = props.type ? props.type : ''
  return (
    <input
      onInput={props.onChange}
      pattern="[0-9]*"
      className={`fld ${type}`}
      type="text"
      placeholder={props.text}
      readOnly={props.readonly}
      value={props.value} />
  )
}

const CloseButton = (props) => {
  return (
    <div className="closeButton" onClick={props.onClick}>
      <svg width="20" height="20" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.48" d="M11.4531 9.93L18.2969 0.640625L21.625 2.64L14.02 13.0859L22 24L18.6953 26L11.4766 16.27L4.25781 26L0.953125 24L8.91 13.0859L1.30469 2.64L4.60938 0.640625L11.4531 9.93Z" fill="black" />
      </svg>
    </div>
  )
}

ReactDOM.render(<App />, container);