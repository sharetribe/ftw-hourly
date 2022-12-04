import React, { useState } from 'react';
import {
  Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails,
  AccordionSummary as MuiAccordionSummary,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const SimpleAccordion = props => {
  const { className, label, children, onExpand } = props;

  const [isExpanded, setExpanded] = useState(false);

  const handleChange = () => {
    onExpand(!isExpanded);
    setExpanded(oldIsExpanded => !oldIsExpanded);
  };

  const Accordion = styled(props => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    justifyContent: 'center',
    width: '100%',
    border: 'none',
    marginTop: '10px',
    '&.MuiAccordion-root:before': {
      display: 'none',
    },
  }));

  const AccordionSummary = styled(props => (
    <MuiAccordionSummary expandIcon={<ExpandMoreIcon />} {...props} />
  ))(({ theme }) => ({
    '& .MuiAccordionSummary-content': {
      display: 'flex',
      justifyContent: 'center',
      flexGrow: '0',
      border: '0',
    },
  }));

  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    border: '0',
    paddingInline: '0',
  }));

  return (
    <Accordion expanded={isExpanded} onChange={handleChange}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>{label}</AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
};

export default SimpleAccordion;
