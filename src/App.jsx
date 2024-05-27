import { useState, useEffect } from 'react'
import './App.css'
// import Preview from './Preview.jsx'
import apiUrl from './config';

// const hostedFrom = `http://localhost:3000`
// const hostedFrom = `https://cvmkr-backend.onrender.com`
const hostedFrom = apiUrl;

const options = [
  {color:'secondary', label: 'Flavor', name:'flavors', options:['zephyr', 'yeti', 'vapor', 'united', 'superhero', 'spacelab', 'solar', 'slate', 'sketchy', 'simplex', 'sandstone', 'quartz', 'pulse', 'morph', 'minty', 'materia', 'lux', 'lumen', 'litera', 'journal', 'flatly', 'darkly', 'cyborg', 'cerulean', 'cosmo']},
  {color:'danger', label: 'Image Size',  name:'imageSize', options:[0, 1, 2]},
  {color:'primary', label: 'Text Color', name:'textColor', options:['light', 'dark', 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'body', 'muted', 'white', 'black-50', 'white-50']},
  {color:'success', label: 'Background Color', name:'backgroundColor', options:['bg-primary', 'bg-secondary', 'bg-success', 'bg-danger', 'bg-warning', 'bg-info', 'bg-light', 'bg-dark', 'border-primary', 'border-secondary', 'border-success', 'border-danger', 'border-warning', 'border-info', 'border-light', 'border-dark']},
  {color:'warning', label: 'Language', name:'language', options:['spa','eng']}
]

function App() {
  const [state, setState] = useState(
    {yourjson:"", file:null, imageSize:"default", flavors:"default", textColor:"default", backgroundColor:"default", language:"default"}
  )


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


  function handleSelectChange(event){
    const field = event.target.name
    const value = event.target.value
    setState({...state, [field]:value})

  }


  async function generate(e){
    e.preventDefault()
    if (!state.file) {
      alert('No file selected');
      return;
    }

    setState({...state, cv: null, contents:`<div>Don't go away! Your CV will be ready in a minute! </div><img src="./pezoteloadimg.png" class="loader"/>`})

    fileReader.readAsText(state.file);
  };


  const fileReader = new FileReader();
  fileReader.onload = async(e) => {
    try {
      const jsonContent = JSON.parse(e.target.result);
      
      // Add here formData making and post-fetching
      const fd = new FormData();
      fd.append('jsonContent', JSON.stringify(jsonContent));
      // fd.append('flavors', state.flavors)
      // fd.append('imageSize', state.imageSize);
      // fd.append('textColor', state.textColor);
      // fd.append('backgroundColor', state.backgroundColor);
      // fd.append('language', state.language);
      for (let choice of options) fd.append(choice.name, state[choice.name])



      const request = await fetch(
        hostedFrom+'/generate',
        { method: "POST",
          headers: {"Content-Type":"application/x-www-form-urlencoded"},
          body: new URLSearchParams(fd)
        }) 

      const response = await request.text();

      const blob = new Blob([response]);
      const url = URL.createObjectURL(blob)

      setState({...state, contents:response, cv:url})

    } catch (error) {
      console.error('Error reading or parsing the file:', error);
    }
  };


  function renderingOption(kv){
    return(
    <div key={kv.name} className="optn" >
      <label className='fs-5'> {kv.label} </label>
      <select className={`badge  bg-${kv.color} fs-5`} name={kv.name} onChange={handleSelectChange}> 
        <option value="default">default</option>
        {kv.options.map((element)=> <option key={element} value={element}>{element}</option>)}
      </select>
    </div>)
  }


  return (
    <>
      <div>
      <h1>CV-maker<i className="bi bi-file-earmark-check"></i></h1>
          <p>Download the JSON and model it after your own CV</p>
      <div className="d-grid gap-2">
        <button onClick={newOne} className='btn btn-dark'>New <i className="bi bi-filetype-json"></i></button>
      </div>
      <form onSubmit={generate}>
        <input className='form-control'  type="file" id="jsonUpload" name="jsonUpload" accept=".json" onChange={handleFileChange} required />

          <div className="flx">

          {
            options.map((option)=> renderingOption(option))
          }

          </div>

        <img src="./pezotecv.jpeg" alt="nosy pezote!" useMap="#pezote" width="307px" height="307px"/>

        <map name="pezote">
          <area onClick={(e)=>{e.target.parentElement.parentElement.requestSubmit()}} shape="circle" coords="174,163,25" alt="Nosy pezote!" className="pointer"/>
        </map>


      </form>

      </div>
      { state.cv && <div>If you like this <strong>preview</strong>, download the actual file <a href={state.cv} download="cv.html"> here </a></div> }
      { state.contents && <div style={{maxWidth:"100%"}}  dangerouslySetInnerHTML={{__html:state.contents}}/> }

      <div className='card text-dark bg-light mb-3'>
      <p>Open the resulting HTML file. Do <strong>CTRL+P</strong> and select <strong>Destination: <i>Save to PDF</i></strong></p>
      <p className='text-secondary'>Best results with these settings:
        Orientation=<strong><i>Portrait</i></strong>,  Margins=<strong><i>None</i></strong>, Scale=<strong><i>Default</i></strong> (or <strong><i>Fit to page width</i></strong>)
      </p>
      </div>




    </>

  )
}


      // <img src="./pezoteloadimg.png" className="loader"/>


          // <div className="d-grid gap-2">
          //    <button className='btn btn-success h2' type="submit"><i className="bi bi-cloud-arrow-up"></i></button>
          //  </div>


      // { state.url && <a href={state.url} download="your_json.json"> Download </a> }




        // <select className="form-select" name="flavor" onChange={handleSelectChange}>
        //   <option value="default">default</option>
        //   {flavors.map((element) => <option key={element} value={element}>{element}</option> )}
        // </select>
        //
        //
        // <select className="form-select" name="imageSize" onChange={handleSelectChange}>
        //   <option value="default">default</option>
        //   {imageSize.map((element) => <option key={element} value={element}>{element}</option> )}
        // </select>
        //
        // <select className='form-select' name="textColor" onChange={handleSelectChange}> 
        //   <option value="default">default</option>
        //   {textColor.map((element)=> <option key={element} value={element}>{element}</option>)}
        // </select>
        //
        // <select className="form-select" name='backgroundColor' onChange={handleSelectChange}>
        //   <option value="default">default</option>
        //   {backgroundColor.map((element)=> <option key={element} value={element}>{element}</option>)}
        //
        // </select>




export default App
