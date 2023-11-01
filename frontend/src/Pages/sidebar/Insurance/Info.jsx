import React,{useState}from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { motion } from 'framer-motion';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import "./info.css"
import InsuranceForm from './InsuranceForm';
import axios from 'axios';



const apiUrl = 'https://omnireports.azurewebsites.net/api/CRUD_irwb';

  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '0 10%',
      height: '100vh',
      width: '70vw',
      marginRight: '180px',
    },
    infoContainer: {
      padding: '40px',
      borderRadius: 20,
      boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.2)',
      width: '100%',
      height: '90%',
    },
    infotext: {
      color: '#333',
      marginBottom: 20,
    },
    heading: {
      marginBottom: 20,
      fontWeight: 'bold',
    },
    card: {
      display: 'flex',
      marginTop: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.2)',
      borderRadius: 10,
      padding: '24px',
      background: 'linear-gradient(to right, #1e3c72, #2a5298)',
      color: 'white',
      padding: 20,
    },
    button: {
      margin: theme.spacing(1),
      background: 'linear-gradient(to right, #f2994a, #f2c94c)',
      color: 'white',
      fontSize: '16px',
      padding: '12px 24px',
      borderRadius: '8px',
      '&:hover': {
        background: '#f2c94c',
      },
    },
    zoomedCard: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '71%',
      height: '95%',
      marginLeft: '10%',
      zIndex: 10,
      background: 'linear-gradient(to top, #cfd9df, #e2ebf0)',
      color: '#333',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflowY: 'scroll',
      borderRadius: 20,
      boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.4)',
    },
    closebutton: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      padding: '12px 24px',
      borderRadius: 8,
      fontSize: '18px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background 0.3s, color 0.3s',
      '&:hover': {
        background: '#c0392b',
      },
    },
    infoHeading: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '16px',
    },
    infoBody: {
      fontSize: '16px',
      lineHeight: 1.6,
      marginBottom: '12px',
    },
    
    formContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  
    formSection: {
      flex: 1,
      padding: '20px',
    },
  
    formlabel: {
      marginBottom: '10px',
    },
  
    formInput: {
      marginBottom: '10px',
      padding: '5px',
    },
    fixedFormContainer: {
      position: 'fixed',
      top: '51%',
      left: '50.5%',
      transform: 'translate(-50%, -50%)',
      width: '100%',
      zIndex: 1000,
      minHeight:'95%'
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      //backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 999,
    },
    
  }));
  const Info = () => {
    const classes = useStyles();
    const [selectedType, setSelectedType] = useState(null);
    const [fields, setFields] = useState([]);
    const animationVariants = {
      hidden: { opacity: 0, y: -50 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 1, type: 'spring', stiffness: 120 },
      },
    };
  
 
  const handleTypeClick = (type) => {
    setSelectedType(type);

   
    
    let insuranceFields = [];
    if (type === 'Term') {
      insuranceFields = [
        {id :'policyType',label:'Policy Type',type:'text',value:'Term'},
        { id: 'policyNumber', label: 'Policy Number', type: 'text', value: '' },
        { id:'installmentPremiumAmt',label:'Installment Premium Amount',type:'text',value:''},
        { id: 'insuranceCover', label: 'Insurance Cover', type: 'text', value: '' },
        { id:'policyStartdate',label:'Policy Start date',type:'date',value:''},
        { id:'policyEnddate',label:'Policy End date',type:'date',value:''},
        { id:'nextDuedate',label:'Next Due date',type:'date',value:''},
        { id:'premiumPaymentFrequency',label:'Premium Payment Frequency',type:'text',value:''},

      ];
    } else if (type === 'Endowment') {
      insuranceFields = [
        {id :'policyType',label:'Policy Type',type:'text',value:'Endowment'},
        { id: 'policyNumber', label: 'Policy Number', type: 'text', value: '' },
        { id:'installmentPremiumAmt',label:'Installment Premium Amount',type:'text',value:''},
        { id: 'insuranceCover', label: 'Insurance Cover', type: 'text', value: '' },
        { id:'policyStartdate',label:'Policy Start date',type:'date',value:''},
        { id:'policyEnddate',label:'Policy End date',type:'date',value:''},
        { id:'nextDuedate',label:'Next Due date',type:'date',value:''},
        { id:'premiumPaymentFrequency',label:'Premium Payment Frequency',type:'text',value:''},

        
      ];
    }
    else if (type === 'Ulips') {
      insuranceFields = [
        {id :'policyType',label:'Policy Type',type:'text',value:'Ulips'},
        { id: 'policyNumber', label: 'Policy Number', type: 'text', value: '' },
        { id:'installmentPremiumAmt',label:'Installment Premium Amount',type:'text',value:''},
        { id: 'insuranceCover', label: 'Insurance Cover', type: 'text', value: '' },
        { id:'policyStartdate',label:'Policy Start date',type:'date',value:''},
        { id:'policyEnddate',label:'Policy End date',type:'date',value:''},
        { id:'nextDuedate',label:'Next Due date',type:'date',value:''},
        { id:'premiumPaymentFrequency',label:'Premium Payment Frequency',type:'text',value:''},

        
      ];
    }
    else if (type === 'WholeLife') {
      insuranceFields = [
        {id :'policyType',label:'Policy Type',type:'text',value:'Whole Life'},
        { id: 'policyNumber', label: 'Policy Number', type: 'text', value: '' },
        { id:'installmentPremiumAmt',label:'Installment Premium Amount',type:'text',value:''},
        { id: 'insuranceCover', label: 'Insurance Cover', type: 'text', value: '' },
        { id:'policyStartdate',label:'Policy Start date',type:'date',value:''},
        { id:'policyEnddate',label:'Policy End date',type:'date',value:''},
        { id:'nextDuedate',label:'Next Due date',type:'date',value:''},
        { id:'premiumPaymentFrequency',label:'Premium Payment Frequency',type:'text',value:''},
      ];
    }
    else if (type === 'Child') {
      insuranceFields = [
        {id :'policyType',label:'Policy Type',type:'text',value:'Child'},
        { id: 'policyNumber', label: 'Policy Number', type: 'text', value: '' },
        { id:'installmentPremiumAmt',label:'Installment Premium Amount',type:'text',value:''},
        { id: 'insuranceCover', label: 'Insurance Cover', type: 'text', value: '' },
        { id:'policyStartdate',label:'Policy Start date',type:'date',value:''},
        { id:'policyEnddate',label:'Policy End date',type:'date',value:''},
        { id:'nextDuedate',label:'Next Due date',type:'date',value:''},
        { id:'premiumPaymentFrequency',label:'Premium Payment Frequency',type:'text',value:''},

      ];
    }
    else if (type === 'RetirementPlans') {
      insuranceFields = [
        {id :'policyType',label:'Policy Type',type:'text',value:'Retirement Plans'},
        { id: 'policyNumber', label: 'Policy Number', type: 'text', value: '' },
        { id:'installmentPremiumAmt',label:'Installment Premium Amount',type:'text',value:''},
        { id: 'insuranceCover', label: 'Insurance Cover', type: 'text', value: '' },
        { id:'policyStartdate',label:'Policy Start date',type:'date',value:''},
        { id:'policyEnddate',label:'Policy End date',type:'date',value:''},
        { id:'nextDuedate',label:'Next Due date',type:'date',value:''},
        { id:'premiumPaymentFrequency',label:'Premium Payment Frequency',type:'text',value:''},

      ];
    }
    else if (type === 'Health') {
      insuranceFields = [
        {id :'policyType',label:'Policy Type',type:'text',value:'Health'},
        { id: 'policyNumber', label: 'Policy Number', type: 'text', value: '' },
        { id:'installmentPremiumAmt',label:'Installment Premium Amount',type:'text',value:''},
        { id: 'insuranceCover', label: 'Insurance Cover', type: 'text', value: '' },
        { id:'policyStartdate',label:'Policy Start date',type:'date',value:''},
        { id:'policyEnddate',label:'Policy End date',type:'date',value:''},
        { id:'nextDuedate',label:'Next Due date',type:'date',value:''},
        { id:'premiumPaymentFrequency',label:'Premium Payment Frequency',type:'text',value:''},

      ];
    }
    else if (type === 'Home') {
      insuranceFields = [
        {id :'policyType',label:'Policy Type',type:'text',value:'Home'},
        { id: 'policyNumber', label: 'Policy Number', type: 'text', value: '' },
        { id:'installmentPremiumAmt',label:'Installment Premium Amount',type:'text',value:''},
        { id: 'insuranceCover', label: 'Insurance Cover', type: 'text', value: '' },
        { id:'policyStartdate',label:'Policy Start date',type:'date',value:''},
        { id:'policyEnddate',label:'Policy End date',type:'date',value:''},
        { id:'nextDuedate',label:'Next Due date',type:'date',value:''},
        { id:'premiumPaymentFrequency',label:'Premium Payment Frequency',type:'text',value:''},

      ];
    }
    else if (type === 'Motor') {
      insuranceFields = [
        {id :'policyType',label:'Policy Type',type:'text',value:'Motor'},
        { id: 'policyNumber', label: 'Policy Number', type: 'text', value: '' },
        { id:'installmentPremiumAmt',label:'Installment Premium Amount',type:'text',value:''},
        { id: 'insuranceCover', label: 'Insurance Cover', type: 'text', value: '' },
        { id:'policyStartdate',label:'Policy Start date',type:'date',value:''},
        { id:'policyEnddate',label:'Policy End date',type:'date',value:''},
        { id:'nextDuedate',label:'Next Due date',type:'date',value:''},
        { id:'premiumPaymentFrequency',label:'Premium Payment Frequency',type:'text',value:''},

      ];
    }
    else if (type === 'Travel') {
      insuranceFields = [
        {id :'policyType',label:'Policy Type',type:'text',value:'Travel'},
        { id: 'policyNumber', label: 'Policy Number', type: 'text', value: '' },
        { id:'installmentPremiumAmt',label:'Installment Premium Amount',type:'text',value:''},
        { id: 'insuranceCover', label: 'Insurance Cover', type: 'text', value: '' },
        { id:'policyStartdate',label:'Policy Start date',type:'date',value:''},
        { id:'policyEnddate',label:'Policy End date',type:'date',value:''},
        { id:'nextDuedate',label:'Next Due date',type:'date',value:''},
        { id:'premiumPaymentFrequency',label:'Premium Payment Frequency',type:'text',value:''},

      ];
    }
    setFields(insuranceFields);
  };

const handleChange = (id, value) => {
  const updatedFields = fields.map((field) =>
    field.id === id ? { ...field, value: value } : field
  );
  setFields(updatedFields);
};

const handleSubmit = () => {
  const formData = {};
  fields.forEach((field) => {
    formData[field.id] = field.value;
  });

  const requestData = {
    "crudtype": 1,
    "recordid": null,
    "collectionname": "insurance",
    "data":formData}

  axios.post(apiUrl, requestData)
    .then(response => {
      console.log('Data saved successfully!', response.data);
    })
    .catch(error => {
      console.error('Error saving data:', error);
    });
};





const handleClose = () => {
  setSelectedType(null);
};

return (
  <motion.div className={classes.root} initial="hidden" animate="visible" variants={animationVariants}>
    <motion.div className={classes.infoContainer}>
    <Carousel showThumbs={false} showStatus={false} showArrows={true}>
    <div>
            <Typography variant="h4" className={classes.infotext}>
              Types of Insurance Policies in India
            </Typography>
            <Typography variant="body1" className={classes.infotext}>
              Insurance is a tool that provides us with much-needed security against the unknown.
              Selecting the appropriate type of insurance policy with the appropriate quantity is one
              wise decision we must make to protect our possessions or financial stability.
            </Typography>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5" className={classes.heading}>
            LIFE INSURANCE
          </Typography>  
              <button className='insbtn' onClick={() => handleTypeClick('Term')}>
                TERM
              </button>
              <button className='insbtn' onClick={() => handleTypeClick('Endowment')}>
                ENDOWMENT
              </button>
              <button className='insbtn' onClick={() => handleTypeClick('WholeLife')}>
                WHOLE LIFE
              </button>
              <button className='insbtn' onClick={() => handleTypeClick('Ulips')}>
                ULIPS
              </button>
              <button className='insbtn' onClick={() => handleTypeClick('Child')}>
                CHILD
              </button>
              <button className='insbtn' onClick={() => handleTypeClick('RetirementPlans')}>
                RETIREMENT PLANS
              </button>
              </CardContent>
      </Card>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5" className={classes.heading}>
            GENERAL INSURANCE
          </Typography>  
              <button className='insbtn' onClick={() => handleTypeClick('Health')}>
                HEALTH
              </button>
              <button className='insbtn' onClick={() => handleTypeClick('Home')}>
                HOME
              </button>
              <button className='insbtn' onClick={() => handleTypeClick('Motor')}>
                MOTOR
              </button>
              <button className='insbtn' onClick={() => handleTypeClick('Travel')} >
                TRAVEL
              </button>
              </CardContent>
      </Card>
      </div>
          </Carousel>
          </motion.div>
        

          {selectedType && (
                    <div className={classes.overlay}>
            <InsuranceForm
              type={selectedType}
              fields={fields}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              handleClose={handleClose}
            />
         </div>
      )}
    </motion.div>
  );
};

export default Info;