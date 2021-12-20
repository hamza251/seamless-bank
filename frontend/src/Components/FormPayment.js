import { useState } from "react";
import {
    FormControl,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    FormHelperText,
    Button
} from '@mui/material';
import { PieChart, Pie, Cell,Label} from 'recharts';

const FormPayment =(props)=>{
    const {balance,iban,currency} = props;
    const [paymentFormData,setPaymentFormData] = useState({
        amount:0,
        error:null,
        balance:parseInt(balance),
        inputValue:'',
        chartData:[
            {
                "name": "Balance",
                "value": parseInt(balance)
            },
            {
            "name": "Deduct",
            "value": 0
            }
        ],
        isBtnDisable:true
    });

    /**
     * Track whenever something is being typed in the input 
     * 
     * @param {Object} event 
     * @returns 
     */
    const changeHandler = (event) => {
        const inputValue = event.target.value.replace('-',"");
        const {balance} = props;
        const numRegex = /^[0-9\b]+$/;
        console.log('X',inputValue,paymentFormData);
        // if value is not blank, then test the regex
        if (!numRegex.test(inputValue) && inputValue !== '') {
            setPaymentFormData({
                ...paymentFormData,
                error:"Only numbers are allowed",
                isBtnDisable:true
            });

        } else if(parseInt(inputValue) > balance){ // check if input value is greater than the balance
            setPaymentFormData({
                ...paymentFormData,
                error:"Amount can not be greater than the current balance",
            })

        }else if(inputValue === ''){ // if value is empty then reset the payment form
            resetPaymentForm();
        }else {
            // update payment form data states
            setPaymentFormData({
                ...paymentFormData,
                amount:parseInt(inputValue),
                inputValue:parseInt(inputValue),
                error:null,
                chartData:[
                    {
                        "name": "Balance",
                        "value": parseInt(balance) - parseInt(inputValue)
                    },
                    {
                    "name": "Deduct",
                    "value": parseInt(inputValue)    
                    }
                ],
                isBtnDisable:false
            });
        }

    }

    /**
     * Rest form through states 
     */
    const resetPaymentForm = () => {
        setPaymentFormData({
            error:null,
            inputValue:'',
            amount:0,
            balance:parseInt(balance),
            isBtnDisable:true,
            chartData:[
                {
                    "name": "Balance",
                    "value": parseInt(balance)
                },
                {
                    "name": "Deduct",
                    "value": 0    
                }
            ]
        })
    }

    const makePayment = async () => {
        try {
                await fetch(`http://localhost:2400/v1/api/transfer/${iban}?currency=${currency}&amount=${paymentFormData.amount}`,
                    {method:'POST'}
                ).then(res => res.json()).then( (result) => { 
                    if(result.code === 202 ){
                        alert('Payment has been made successfully.');
                        window.location.reload(false);
                    } 
                }).catch(error=>{
                    throw new Error(error.message);
                });
        } catch (error) {
            alert(error.message);
        }
    }
    return (
        <div>
            <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="input_amount">Amount</InputLabel>
                <OutlinedInput
                    id="input_amount"
                    value={paymentFormData.inputValue}
                    inputProps={{
                        type:"number",
                        autocomplete:"off"

                    }}
                    onChange={(event)=>{ changeHandler(event) }}
                    startAdornment={<InputAdornment position="start">{props.currency}</InputAdornment>}
                    label="Amount"
                />
                {paymentFormData.error!=null && (
                    <FormHelperText error id="accountId-error">
                        {paymentFormData.error}
                    </FormHelperText>
                )}
            
            </FormControl>
            <PieChart width={730} height={250}>
                <Pie
                    data={paymentFormData.chartData} 
                    cx="42%" 
                    cy="50%" 
                    innerRadius={70}
                    outerRadius={80} 
                    fill="#8884d8"
                    paddingAngle={1}
                    legendType="line"
                >
                    <Label 
                        value={`Balance:${balance} `} 
                        position="centerBottom" 
                        className='label-top' 
                        fontSize='15px'
                    />
                    {paymentFormData.chartData.map((entry, index) => <Cell key={index}   fill={index === 1 ? "#8884d8" : "#1b1b66"}/>)}
                </Pie>
            </PieChart>
            <Button variant="contained" onClick={() => {makePayment()} } disabled={paymentFormData.isBtnDisable} fullWidth={true} size="medium" style={{marginTop:"10px"}}>Pay</Button>
        </div>
    )
} 

export default FormPayment;