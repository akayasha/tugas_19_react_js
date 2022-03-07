import React,{Component} from 'react';
import {Card,Button,Row,Col,Container,ListGroup,FormControl} from 'react-bootstrap'
import axios from 'axios';

class App extends Component{
  constructor(){
    super();
    this.state ={
      dataApi : [ ],
      dataPost :{
        id :0,
        nama_karyawan : '',
        jabatan : '',
        jenis_kelamin : '',
        tanggal_lahir : ''
      },
      edit : false


    }
    this.reloadData =this.reloadData.bind(this);
    this.hapus = this.hapus.bind(this);
    this.SimpanData = this.SimpanData.bind(this);
    this.Submit = this.Submit.bind(this);
  }

  SimpanData(e){
    let newdata ={ ...this.state.dataPost};
    if (this.state.edit ===false){
    newdata['id'] = new Date().getTime();}
    newdata[e.target.name] = e.target.value;
    this.setState({
      dataPost :newdata
    })
  }

  Submit(){
    if(this.state.edit === false ){
    axios.post(`http://localhost:8000/data-karyawan`,  this.state.dataPost)
      .then((res) =>{
        this.reloadData();
        this.clear();
    });
  }else{
    axios.put(`http://localhost:8000/data-karyawan/${this.state.dataPost.id}`
      ,this.state.dataPost).then(()=> {
        this.reloadData();
        this.clear();
      })
  }}

  hapus(e){
    fetch(`http://localhost:8000/data-karyawan/${e.target.value}`,
      {method : 'DELETE'}).then (res => this.reloadData())
  }

  clear(){
    let newdata ={...this.state.dataPost};
    newdata['id']=' '
    newdata['nama_karyawan']=' '
    newdata['jabatan']=' '
    newdata['jenis_kelamin']=' '
    newdata['tanggal_lahir']=' '

    this.setState({
      dataPost : newdata
    })
  }

  reloadData(){
    axios.get(`http://localhost:8000/data-karyawan`).then (res =>{
      this.setState({
        dataApi : res.data,
        edit :false
      })
    });
  }

  componentDidMount(){
      this.reloadData()
    }

  getDataid = e =>{
    axios.get(`http://localhost:8000/data-karyawan/${e.target.value}`).then (res =>{
      this.setState({
        dataPost :res.data,
        edit : true
      })
    })
  }

    render(){
      return(
        <div>
          <Container>
          <h1 style ={{textAlign :'center'}}>Data karyawan</h1>
          <hr />
          <FormControl type='text' value={this.state.dataPost.nama_karyawan} onChange={this.SimpanData} placeholder ='Masukan Nama' name='nama_karyawan' style ={{width : '450px',margin : '20px'}} />
          <FormControl type='text' value={this.state.dataPost.jabatan} onChange={this.SimpanData} placeholder ='Masukan Jabatan' name='jabatan' style ={{width : '450px',margin : '20px'}} />
          <FormControl type='text' value={this.state.dataPost.jenis_kelamin} onChange={this.SimpanData} placeholder ='Jenis Kelamin' name='jenis_kelamin' style ={{width : '450px',margin : '20px'}} />
          <FormControl type='text' value={this.state.dataPost.tanggal_lahir} onChange={this.SimpanData} placeholder ='tanggal lahir' name='tanggal_lahir' style ={{width : '450px',margin : '20px'}} />
          <Button type='submit' variant = 'primary' style ={{width : '250px',margin : '20px'}} onClick={this.Submit}>Simpan Data</Button>
            <hr /> <hr />

          {this.state.dataApi.map((data,index) =>{
              return(
                <div key={index}>
                  <Card style ={{width : '350px'}}>
                    <ListGroup variant="flush">
                      <ListGroup.Item>Nama          :{data.nama_karyawan}</ListGroup.Item>
                      <ListGroup.Item>Jabatan       :{data.jabatan}</ListGroup.Item>
                      <ListGroup.Item>Jenis Kelamin :{data.jenis_kelamin}</ListGroup.Item>
                      <ListGroup.Item>Tanggal Lahir           :{data.tanggal_lahir}</ListGroup.Item>
                      </ListGroup>
                    <Row style={{justifyContent :'center'}}>
                      <Col>
                        <Button variant='danger' value={data.id} style={{width :'150px'}} onClick={this.hapus}>Delete</Button>
                      </Col>
                      <Col >
                        <Button variant ='info'  value={data.id} style={{width :'150px'}} onClick={this.getDataid}>Edit</Button>
                      </Col>
                    </Row>
                    <br />
                    </Card>
                    <br />
                  </div>
                );
            })}
          </Container>
        </div>
      );
    }




  }

export default App;
