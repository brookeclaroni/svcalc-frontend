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

function App() {
  const [textList, setTextList] = useState([]);
  const [selectedSkillImage, setSelectedSkillImage] = useState(null);
  const [skillImages, setSkillImages] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');

  const eventOptions = ['vt', 'ub', 'bb', 'fx'];

  function addText(skill, image) {
    setTextList([...textList, { skill, image }]);
    setSkillImages([...skillImages, image]);
  }

  const handleEventChange = (event) => {
    setSelectedEvent(event.target.value);

    // Reset the skill list when the event changes
    setTextList([]);
    setSkillImages([]);
    setSelectedSkillImage(null);
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
                {event}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedEvent && (
          <>
            <Typography variant="h5" component="div" style={{ marginBottom: 20 }}>
              Select {selectedEvent ? `${selectedEvent} skills` : 'skills'}
            </Typography>

            <SkillInput
              addSkill={(skill, image) => addText(skill, image)}
              setSelectedSkillImage={setSelectedSkillImage}
              skillImages={skillImages}
              setSkillImages={setSkillImages}
              selectedEvent={selectedEvent}
            />
          </>
        )}

        <List>
          {textList.map((item, index) => (
            <ListItem key={index}>
              <ListItemText primary={item.skill} />
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
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default App;