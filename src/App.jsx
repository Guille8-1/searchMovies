import './App.css'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useMovies } from './hooks/useMovies.js'
import { Movies } from './components/Movies.jsx'
import debounce from 'just-debounce-it'


function useSearch () {

  const [search, updateSearch] = useState('')
  const [error, setError] = useState(null)
  const isFirstInput = useRef(true)

  useEffect(() => {
    if(isFirstInput.current){
      isFirstInput.current = search === ''
      return
    }
    if(search === ''){
      setError('No hay datos ingresados')
      return
    }
    if(search.match(/^\d+$/)){
      setError('No introducir numeros')
      return
    }
    if(search.length < 3){
      setError('Debe introducir mas de 3 caracteres')
      return
    }
    setError(null)
  }, [search])
  return {search, updateSearch, error}
}
function App() {
  const [sort, setSort] = useState(false)
  const { search, updateSearch, error } = useSearch()
  const { movies: mappedMovies, loading, getMovies } = useMovies({ search, sort })
  
  const debounceGetMovies = useCallback(
    debounce(search =>{
      console.log('search', search) 
      getMovies({search})
    }, 300)
    ,[getMovies]
  )

  const handleSet = ()=>{
    setSort(!sort)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    getMovies({search})
  }
  const handleChange = (e) => {
    const onSearch = e.target.value
    updateSearch(onSearch)
    debounceGetMovies(onSearch)
  }

  return (
    <div className='page'>
    <header>
      <h1>Buscador De Peliculas</h1>
      <form className='form' onSubmit={handleSubmit}>
          <input name='query' placeholder='Peliculas a Buscar' value={search} type="text" onChange={handleChange} />
          <input type="checkbox" onChange={handleSet} checked={sort}/>
          <button type='submit'>Buscar</button>
      </form>
      {error && <p style={{color:'red'}}>{error}</p>}
    </header>
      <main>
        {
          loading ? <p>LOADING MOVIES</p> : <Movies movies={mappedMovies} />
        }
      </main>
    </div>
  )
}

export default App
