import "./App.css";
import React from 'react';
import { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import axios from "axios";
import Modal from "react-modal";
import { Chart, Series, Export } from 'devextreme-react/chart';
import chat from './img/chat.png';
import Pdf from "react-to-pdf";

const ref = React.createRef();
function PokeDex() {
  const [pokemons, setPokemons] = useState([]);
  const [pokemonDetail, setPokemonDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');


  const getData = async () => {
    await axios.get(`https://pokeapi.co/api/v2/pokemon`)
    .then(res => {
      if(res.data.results.length > 0) {
        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
        setPokemons(res.data.results)
      }
    })
    .catch(err => alert(JSON.stringify(err)))
  }


  const paginateData =  async () => {
    await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${page}`)
    .then(res => {
      if(res.data.results.length > 0) {
        setPokemons(res.data.results)
      }
    })
    .catch(err => alert(JSON.stringify(err)))
  }


  const getDetailData = async (url) => {
    await axios.get(url)
    .then(res => {
        console.log(res)
        setPokemonDetail(res.data)
    })
    .catch(err => alert(JSON.stringify(err)))
  }

  const filterData =  (val) => {
    let filteredList = pokemons.filter((pokemon) => pokemon.name.includes(val))
    if(filteredList.length > 0) {
      setPokemons(filteredList)
      setSearchText('')
      return;
    }
    setSearchText('No Data found')
  }

  useEffect(() => {
    getData()
  },[])

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: '60%',
      overflowY: 'scroll',
      height: '100%',
      position: 'absolute',
    },
    overlay: { backgroundColor: "grey" },
  };

  if (!isLoading && pokemons.length === 0) {
    return (
      <div>
        <header className="App-header">
          {/* <h1>Welcome to pokedex !</h1>
          <h2>Requirement:</h2>
          <ul>
            <li>
              Call this api:https://pokeapi.co/api/v2/pokemon to get pokedex, and show a list of pokemon name.
            </li>
            <li>Implement React Loading and show it during API call</li>
            <li>when hover on the list item , change the item color to yellow.</li>
            <li>when clicked the list item, show the modal below</li>
            <li>
              Add a search bar on top of the bar for searching, search will run
              on keyup event
            </li>
            <li>Implement sorting and pagingation</li>
            <li>Commit your codes after done</li>
            <li>If you do more than expected (E.g redesign the page / create a chat feature at the bottom right). it would be good.</li>
          </ul> */}
        </header>
      </div>
    );
  }

  return (
    <div>
      <header className="App-header">
      <img src={chat} className="chat" />
        {isLoading ? (
          <>
            <div className="App">
              <header className="App-header">
                <div className="text-center">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Loader.gif/480px-Loader.gif" className="img-fluid" />
                </div>
              </header>
            </div>
          </>
        ) : (
          <>
            <h1>Welcome to pokedex !</h1>
            <div className="row justify-content-center">
              <div className="col-lg-12 mb-3">
                <input type="text" placeholder="Search here..." 
                      onChange={(e) => {
                        if(!e.target.value) {
                          getData()
                        }
                        filterData(e.target.value)
                      }} 
                className="form-control" />
              </div>
            </div>
            {
              !searchText
              ?
              <>
                <div className="d-flex">
                    <table class="table text-white table-bordered">
                        <thead>
                          <tr>
                            <th scope="col">Name</th>
                            <th scope="col">View</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            pokemons.map((pokemon,index) => (
                              <>
                                <tr className="hover-item">
                                  <td>{pokemon.name}</td>
                                  <td>
                                    <button className="btn btn-primary btn-sm"
                                      onClick={() => {
                                        getDetailData(pokemon.url)
                                      }}
                                      >Show Details</button>
                                  </td>
                                </tr>
                              </>
                            ))
                          }
                          
                        </tbody>
                      </table>
                      
                  </div>
                  <nav aria-label="Page navigation example">
                  <ul class="pagination">
                    <li class={page <=1 ? 'page-item disabled' :'page-item'} >
                      <a class="page-link"
                      onClick={() => {
                        setPage(page-1)
                        paginateData()
                      }}
                      >Previous</a>
                      </li>
                    <li class="page-item" onClick={() => {
                      setPage(page+1)
                      paginateData()
                    }}><a class="page-link" >Next</a></li>
                  </ul>
                </nav>
                </>
                :
                <h6 className="lead">{searchText}</h6>
            }
            
            
          </>
        )}
      </header>
      {pokemonDetail && (
        <Modal
        
          isOpen={pokemonDetail}
          contentLabel={pokemonDetail?.name || ""}
          onRequestClose={() => {
            setPokemonDetail(null);
          }}
          style={customStyles}
        >
          <Pdf targetRef={ref} filename="code-example.pdf">
            {({ toPdf }) => <button className="btn btn-success mx-auto d-block" onClick={toPdf}>Download</button>}
          </Pdf>
          <div ref={ref}>
            {
              <div className="text-center">
                <img src={pokemonDetail.sprites.front_default} height={200}></img>
              </div>
            }
            
            <ul class="nav nav-tabs" id="myTab" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#name" type="button" role="tab" aria-controls="name" aria-selected="true">Stat Name</button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="base-tab" data-bs-toggle="tab" data-bs-target="#base" type="button" role="tab" aria-controls="base" aria-selected="false">Base Stat</button>
              </li>
            </ul>
            <div class="tab-content" id="myTabContent">
              <div class="tab-pane fade show active" id="name" role="tabpanel" aria-labelledby="name-tab">
                {pokemonDetail.stats.map((stat) => (
                  <p>{stat.stat.name}</p>
                ))}
              </div>
              <div class="tab-pane fade" id="base" role="tabpanel" aria-labelledby="base-tab">
                {pokemonDetail.stats.map((stat) => (
                    <p>{stat.base_stat}</p>
                  ))}
              </div>
            </div>
            <Chart id="chart" dataSource={pokemonDetail.stats}>
              <Series
                valueField="base_stat"
                argumentField="effort"
                name="Stats"
                type="bar"
                color="#ffaa66" />
                <Export
                    enabled={true}
                    printingEnabled={false}
                />
            </Chart>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default PokeDex;
