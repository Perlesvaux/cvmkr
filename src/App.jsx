import { useState, useEffect } from 'react'
import './App.css'
// import Preview from './Preview.jsx'
import apiUrl from './config';

// const hostedFrom = `http://localhost:3000`
// const hostedFrom = `https://cvmkr-backend.onrender.com`
const hostedFrom = apiUrl;


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

    setState({...state, contents:`<img src="./pezoteloadimg.png" class="loader"/>`})

    fileReader.readAsText(state.file);
  };


  const fileReader = new FileReader();
  fileReader.onload = async(e) => {
    try {
      const jsonContent = JSON.parse(e.target.result);
      
      // Add here formData making and post-fetching
      const fd = new FormData();
      fd.append('jsonContent', JSON.stringify(jsonContent));


      const request = await fetch(
        hostedFrom+'/generate',
        { method: "POST",
          headers: {"Content-Type":"application/x-www-form-urlencoded"},
          body: new URLSearchParams(fd)
        }) 

      const response = await request.text();

      // console.log(response)

      // const data = await response.json()
      const blob = new Blob([response]);
      const url = URL.createObjectURL(blob)

      // const a = document.createElement('a')
      // a.href=url
      // a.download='cv.html'
      // document.body.appendChild(a)
      // a.click()
      // document.body.removeChild(a)
      // URL.revokeObjectURL(url)


      // setState({...state, contents:JSON.stringify(jsonContent, null, 2)})
      setState({...state, contents:response, cv:url})





    } catch (error) {
      console.error('Error reading or parsing the file:', error);
    }
  };


  return (
    <>
      <>
      <h1>CV-maker<i className="bi bi-file-earmark-check"></i></h1>
          <p>Download the JSON and model it after your own CV</p>
      <div className="d-grid gap-2">
        <button onClick={newOne} className='btn btn-primary'>New <i className="bi bi-filetype-json"></i></button>
      </div>
      <form onSubmit={generate}>
        <input className='form-control'  type="file" id="jsonUpload" name="jsonUpload" accept=".json" onChange={handleFileChange} />

        <img src="./pezotecv.jpeg" alt="nosy pezote!" useMap="#pezote" width="307px" height="307px"/>

        <map name="pezote">
          <area onClick={(e)=>{e.target.parentElement.parentElement.requestSubmit()}} shape="circle" coords="174,163,25" alt="Nosy pezote!" className="pointer"/>
        </map>


      </form>
      </>
      { state.cv && <>If you like this <strong>preview</strong>, download the actual file <a href={state.cv} download="cv.html"> here </a></> }

      { state.contents && <div dangerouslySetInnerHTML={{__html:state.contents}}/> }


    </>
  )
}


      // <img src="./pezoteloadimg.png" className="loader"/>


          // <div className="d-grid gap-2">
          //    <button className='btn btn-success h2' type="submit"><i className="bi bi-cloud-arrow-up"></i></button>
          //  </div>


      // { state.url && <a href={state.url} download="your_json.json"> Download </a> }

export default App
