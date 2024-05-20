import { useState, useEffect } from 'react'
import './App.css'

const hostedFrom = `http://localhost:3000`

function App() {
  const [state, setState] = useState({yourjson:"", file:null})


  async function newOne (){
    const response = await fetch(
      hostedFrom+'/new', {
        method: "POST",
        headers: {"Content-Type":"application/x-www-form-urlencoded"}
    })

    const data = await response.json()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href=url
    a.download='your_json.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }


  function handleFileChange(event){
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'application/json') {
      setState({...state, file:selectedFile});
    } else {
      alert('Please select a valid JSON file');
      event.target.value = ''; // Clear the input
    }
  };

  async function generate(e){
    e.preventDefault()
    if (!state.file) {
      alert('No file selected');
      return;
    }

    fileReader.readAsText(state.file);
  };


  const fileReader = new FileReader();
  fileReader.onload = async(e) => {
    try {
      const jsonContent = JSON.parse(e.target.result);
      
      // Add here formData making and post-fetching
      const fd = new FormData();
      fd.append('jsonContent', jsonContent);


      const request = await fetch(
        hostedFrom+'/generate',
        { method: "POST",
          headers: {"Content-Type":"application/x-www-form-urlencoded"},
          body: new URLSearchParams(fd)
        }) 

      const response = await request.text();

      console.log(response)


      // setState({...state, contents:JSON.stringify(jsonContent, null, 2)})
      setState({...state, contents:response})

    } catch (error) {
      console.error('Error reading or parsing the file:', error);
    }
  };


  return (
    <>
      {state.contents ?
      <div dangerouslySetInnerHTML={{__html:state.contents}}/> :
      <>
      <form onSubmit={generate}>
        <input type="file" id="jsonUpload" name="jsonUpload" accept=".json" onChange={handleFileChange} />
        <button type="submit">submit</button>
      </form>
      <button onClick={newOne}>elpepe </button>
      </>
      }
    </>
  )
}
      // { state.url && <a href={state.url} download="your_json.json"> Download </a> }

export default App
