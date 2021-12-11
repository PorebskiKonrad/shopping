import './App.css';
import Header from './components/Header'
import Items from './components/Items'
import AddItem from './components/AddItem';
import { useState, useEffect } from 'react'
import { Alert, Container, Divider, Snackbar } from '@mui/material';
import { Box } from '@mui/system';

function App() {
  const [showAddItem, toggleShowAddItem] = useState(false)
  const [items, setItems] = useState([])
  const [created, setCreated] = useState(false)
  const [deleted, setDeleted] = useState(false)
  // Get new items
  useEffect(() => {
    ; (async () => {
      const resp = await fetch('http://localhost:3500/list')
        .then(resp => resp.json())
      setItems(await resp)
    })();
    return () => {

    }
  }, [])

  const getItems = async () => {
    const resp = await fetch('http://localhost:3500/list')
      .then(resp => resp.json())
    setItems(await resp)
  }


  // Set Non-Important
  const setChecked = async (id) => {
    await fetch(`http://localhost:3500/list/${id}`, {
      method: 'PATCH'
    })
    setItems(items.map((item) => item.id === id ? { ...item, important: !item.important } : item))
    getItems()
  }

  // Delete Item
  const deleteItem = async (id) => {
    console.log(id)
    await fetch(`http://localhost:3500/list/${id}`, {
      method: 'DELETE'
    }).then(async resp => {
      getItems()
      if (resp.status === 200) {
        setDeleted(true);
        setTimeout(() => { setDeleted(false); }, 500);
      }
    })
  }

  // Add Item
  const addItem = async (item) => {
    let body = (JSON.stringify(item))
    await fetch('http://localhost:3500/list', {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body
    }).then(async resp => {
      if (resp.status === 201) {
        setCreated(true);
        setTimeout(() => { setCreated(false); }, 500);
      }
    })
    getItems()
  }

  return (
    <Container maxWidth='sm'>
      <Snackbar open={created} autoHideDuration={4}>
        <Alert severity='success' sx={{ width: '100%' }}>
          Item succesfully added.
        </Alert>
      </Snackbar>

      <Snackbar open={deleted} autoHideDuration={4}>
        <Alert severity='info' sx={{ width: '100%' }}>
          Item succesfully removed.
        </Alert>
      </Snackbar>


      <Box
        sx={{
          backgroundColor: 'primary.dark',
          maxWidth: 500,
          margin: 1,
          marginTop: 4
        }
        }>
          
        <Header onClick={() => toggleShowAddItem(!showAddItem)} />
        {showAddItem && <AddItem fade={showAddItem} onAdd={addItem} />}
        <Divider />
        <Items items={items} onDelete={deleteItem} onCheckedToggle={setChecked} />
      </Box>
    </Container>
  );
}

export default App;
