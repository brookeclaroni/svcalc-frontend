import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import skillsData from './data/skills.json';

function SkillInput({ addSkill, setSelectedSkillImage, skillImages, setSkillImages, selectedEvent }) {
  const [inputValue, setInputValue] = useState('');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [filteredSkills, setFilteredSkills] = useState([]);

  useEffect(() => {
      console.log('Selected Event:', selectedEvent);

    // Check if selectedEvent is defined before filtering skills
    if (selectedEvent) {
      const skillsForEvent = skillsData.filter((skill) => skill.event === selectedEvent);
      setFilteredSkills(skillsForEvent);
    }
  }, [selectedEvent]);

  function handleSkillSelect(value) {
    const selectedSkillData = filteredSkills.find((skill) => skill.description === value);
    if (selectedSkillData) {
      addSkill(selectedSkillData.skill_code, selectedSkillData.description, "images/"+selectedSkillData.img_file);
      setSelectedSkill(selectedSkillData);
      setInputValue('');
      setSelectedSkillImage(selectedSkillData.img_file);
      setSkillImages([...skillImages, "images/"+selectedSkillData.img_file]);
    }
  }

  return (
    <div style={{ marginTop: 20, marginBottom: 20 }}>
      <Autocomplete
        freeSolo
        options={filteredSkills.map((skill) => skill.description)}
        value={inputValue}
        inputValue={inputValue}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Start typing skill..."
            variant="outlined"
            onChange={(e) => setInputValue(e.target.value)}
          />
        )}
        onInputChange={(e, value) => setInputValue(value)}
        onChange={(e, value) => handleSkillSelect(value)}
      />
    </div>
  );
}

export default SkillInput;
