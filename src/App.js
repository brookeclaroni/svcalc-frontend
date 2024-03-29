import React, { useState } from 'react';
import SkillInput from './SkillInput';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

// Mapping function for event codes to formal text
const mapEventCodeToText = {
  ub: 'Uneven Bars',
  bb: 'Balance Beam',
  fx: 'Floor Exercise',
};

function App() {
  const [skillList, setSkillList] = useState([]);
  const [selectedSkillImage, setSelectedSkillImage] = useState(null);
  const [skillImages, setSkillImages] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [startValue, setStartValue] = useState(null);

  const eventOptions = ['ub', 'bb', 'fx'];

  function addSkillToSkillList(code, description, image) {
    setSkillList([...skillList, { code, description, image, connection: 'disconnected' }]);
    setSkillImages([...skillImages, image]);
  }

  const handleEventChange = (event) => {
    setSelectedEvent(event.target.value);

    // Reset the skill list when the event changes
    setSkillList([]);
    setSkillImages([]);
    setSelectedSkillImage(null);
    setStartValue(null);
  };

  const handleConnectionChange = (index, connection) => {
    const updatedskillList = [...skillList];
    updatedskillList[index].connection = connection;
    setSkillList(updatedskillList);
  };

  const calculateStartValue = async () => {
    console.table(skillList);
  
    const routine = skillList
      .filter((item) => item.code) // Exclude skills with empty or undefined skill code
      .map((item, index, array) => {
        if (index === array.length - 1) {
          return item.code;
        } else if (item.connection === 'connected') {
          return item.code + '+';
        } else {
          return item.code + '/';
        }
      })
      .join('');
  
    console.log({ event: selectedEvent, routine });
  // Construct the URL with parameters
  const url = `http://127.0.0.1:8080/routine/calculate?event=${encodeURIComponent(selectedEvent)}&routine=${encodeURIComponent(routine)}`;

  // Make the GET request
  try {
    const response = await fetch(url);

    const data = await response.text(); // Read the response as text
    console.log('GET request result:', data);
    setStartValue(data);


    // Display the result on the screen or perform any other actions with the data
    // For example, you can set it in the state to render it in the component
    // setSomeState(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    // Handle errors as needed
  }
};
  

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: 20, marginTop: 40 }}>
        <FormControl style={{ marginBottom: 20 }}>
          <Typography variant="h5" component="div" style={{ marginBottom: 10 }}>
            Select an event:
          </Typography>
          <Select value={selectedEvent} onChange={handleEventChange}>
            {eventOptions.map((event, index) => (
              <MenuItem key={index} value={event}>
                {mapEventCodeToText[event]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedEvent && (
          <>
            <Typography variant="h5" component="div" style={{ marginBottom: 20 }}>
              Select {selectedEvent ? `${mapEventCodeToText[selectedEvent]} skills` : 'skills'}
            </Typography>

            <SkillInput
              addSkill={(code, description, image) => addSkillToSkillList(code, description, image)}
              setSelectedSkillImage={setSelectedSkillImage}
              skillImages={skillImages}
              setSkillImages={setSkillImages}
              selectedEvent={selectedEvent}
            />
          </>
        )}

        <List>
          {skillList.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText primary={item.description} />
                {item.image && (
                  <Card style={{ width: '150px', marginLeft: '10px' }}>
                    <CardMedia
                      component="img"
                      alt="Skill Image"
                      height="50"
                      image={item.image}
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                  </Card>
                )}
              </ListItem>
              {index < skillList.length - 1 && ( // Only show connection dropdown between skills
                <ListItem key={`connection-${index}`}>
                  <FormControl style={{ marginLeft: '10px' }}>
                    <Select
                      value={item.connection}
                      onChange={(e) => handleConnectionChange(index, e.target.value)}
                    >
                      <MenuItem value="connected">Connected</MenuItem>
                      <MenuItem value="disconnected">Not Connected</MenuItem>
                    </Select>
                  </FormControl>
                </ListItem>
              )}
            </React.Fragment>
          ))}
        </List>

        <Button variant="contained" color="primary" onClick={calculateStartValue}>
          Calculate Start Value
        </Button>

        {startValue && (
          <Typography variant="body1" style={{ marginTop: 10 }}>
            {startValue}
          </Typography>
        )}
      </Paper>
    </Container>
  );
}

export default App;
