import { useState,useEffect } from "react";
import {
    FormControl,
    Box,
    Card,
} from '@mui/material';
import FormIban from './FormIban';
import FormPayment from './FormPayment';

const Form = () => {

    // set some default state for main form
    const [formData,setFormData] = useState({
        bankName:null,
        iban:null,
        bankLogo:null,
        amount:null,
        currency:null,
        enablePaymentForm:false,
        balance:null
    });

    // set default state so that it can help to reset the whole form
    const [defaultState,setDefaultState] = useState({...formData});
    /**
     * It should be triggered whenever a child sends data to parent.  
     * @param {Object} props 
     */
    const parentFormHandler = (data) => {
        setFormData({
            ...formData,
            currency:data.currency,
            bankName:data.bankName,
            bankLogo:data.bankLogo,
            iban:data.iban,
            enablePaymentForm:data.enablePaymentForm
        });
    }
    /** 
     * fetch balance 
     * @todo need to implement web socket or socket.io 
     */
    useEffect(()=>{
        // try to fetch balance
        async function fetchBalance(){         
            const {data} = await getBalance();
            setFormData({
                ...formData,
                balance:data.balance
            });
        }
        try {
            fetchBalance();
        } catch (error) {
            alert(error.message)            
        }
    },[])

    /**
     * Get balance with every four seconds - SHORT POLLING
     * @todo need to implement web sockets for better performance
     * @returns JSON
     * @throws Error
     */
    const getBalance = async () => {
        return  fetch('http://localhost:2400/v1/api/balance')
                .then(res => res.json()).then( (result) => { 
                    return result;
                }).catch(error=>{
                    throw new Error(error.message);
                });
    }

    return (
        <Box className="main">
            <Card style={{padding:"10px",width:'40%'}}>
                <h1 className="text-center">SEAMLESS BANK</h1>
                <FormControl fullWidth={true}>
                    <span className="balance">Balance: {formData.balance}</span>
                    <FormIban  parentFormHandler={parentFormHandler} /> 
                    
                    { formData.enablePaymentForm && formData.balance > 0 ?
                         <FormPayment 
                            balance={formData.balance} 
                            iban={formData.iban} 
                            currency={formData.currency} 
                            parentFormHandler={parentFormHandler}
                             
                        />
                        : formData.balance < 1 ? 
                            <h1 style={{color:'red',textAlign:'center'}}>You have insufficient funds...</h1>
                        : '' 
                    } 
            
                </FormControl>
            </Card>
        </Box>
    );
}

export default Form;