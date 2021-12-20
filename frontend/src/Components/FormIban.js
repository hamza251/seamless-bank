import { useState } from "react";
import {IbanLookup} from '../Helpers/IbanLookup';
import {ValidateIban} from '../Helpers/Validator';
import {
    TextField,
    CircularProgress
} from '@mui/material';
const FormIban =(props)=>{

    // set default states form Iban Form
    const [formHandler,setFormHandler] = useState({
        errorText:null,
        countryFlag:null,
        isIbanInputDisable:false,
        ibanMaxLength:2, // because we have to fetch the iso code first in order to make other valdations
        bankLogo:null,
        bankName:null,
        isLoading:false
    });
   
    const handleChange = async (event) => {
        const inputValue = event.target.value.toUpperCase(); // set all the values as upper case
        if(inputValue.length < 2){ // reset input errors when value is greater than 2
            setFormHandler({
                ...formHandler,
                errorText:null,
                countryFlag:null,
                ibanMaxLength:2 // because again we have to fetch the iso code first
            });
        }else if(inputValue.length === 2){  // for iso code validation and country flag
            const isoCode = event.target.value.toUpperCase(); // make everything upper case by default

            // fetch country flag and other iban related stuff such as length and currency etc
            const countryIban = IbanLookup().filter(data => data.iso_code === isoCode);
            if(countryIban.length === 0){ // it means no country iso code in our record
                setFormHandler({...formHandler,errorText:"Country iso code is in valid"});  
                return;
            }
            // set country flag, currency, and iban max length to the form
            setFormHandler({
                ...formHandler,
                countryFlag:countryIban[0].flag,
                ibanMaxLength:countryIban[0].length,
                currency:countryIban[0].currency
            });
        } else if(inputValue.length === formHandler.ibanMaxLength) {
            
            // validate iban whether its correct or not
            if(!ValidateIban(inputValue)){
                setFormHandler({...formHandler, errorText:"Invalid Iban number"});
                // hide the payment form
                props.parentFormHandler({
                    enablePaymentForm:false
                });

                return;
            }

            setFormHandler({
                ...formHandler,
                errorText:null,
                isIbanInputDisable:true, // because we dont want input to be editable while sending a request
                isLoading:true, // display the loader,
                bankName:null,
                bankLogo:null
            });
            try {
                // trigger parent function and hide the payment form if its visible 
                props.parentFormHandler({
                    enablePaymentForm:false
                })
                const {data,code,error} = await fetchIbanInfo(inputValue);  
                if(code !== 200){
                    alert(error.message);
                    setFormHandler({
                        ...formHandler,
                        isIbanInputDisable:false,
                        isLoading:false,
                        bankLogo:null,
                        bankName:null,
                    });
                    return;
                }
                setFormHandler({
                    ...formHandler,
                    isIbanInputDisable:false,
                    isLoading:false,
                    bankLogo:data.logo,
                    bankName:data.bank,
                    errorText:null
                });

                // send data to parent component
                props.parentFormHandler({
                    bankLogo:data.logo,
                    bankName:data.bank,
                    iban:inputValue,
                    currency:formHandler.currency,
                    enablePaymentForm:true
                });
                
            } catch (error) {
                alert(error.message);
                setFormHandler({
                    ...formHandler,
                    isIbanInputDisable:false,
                    isLoading:false,
                    bankLogo:null,
                    bankName:null
                });             
            }
        }
    };
    
    /**
     * fetch bank info from the server
     * @param {Integer} ibanNumber 
     * @returns json
     * @throws Error
     */
    const fetchIbanInfo = async (ibanNumber) => {
        return  fetch(`http://localhost:2400/v1/api/bank/${ibanNumber}`)
                .then(res => res.json()).then( (result) => { 
                    return result;
                }).catch(error=>{
                    throw new Error(error.message);
                });
    }

    return (
        <div>
            <TextField 
                {...( formHandler.isIbanInputDisable ? {disabled:true} : {} ) } 
                { ...(formHandler.errorText != null ? {error:true} : {} ) }

                helperText={formHandler.errorText}
                id="outlined-basic" 
                label="Iban Number" 
                variant="outlined"
                size="small"
                inputProps={{
                    maxLength: formHandler.ibanMaxLength
                }}
                style={{width:'100%'}}
                onChange={handleChange}
            />
            <div className="chart-main">
                {formHandler.countryFlag != null ? 
                    <img className="country-flag" alt="Country Flag" src={formHandler.countryFlag} height="20px" />
                    : ''
                }
                {formHandler.isLoading ? <CircularProgress style={{margin:'auto'}} /> : ''}
                
                { formHandler.bankName != null ? <span>{formHandler.bankName}</span> : '' }
                { formHandler.bankLogo != null ? <img alt="Bank Logo" className="bank-logo"  src={formHandler.bankLogo}/> : '' }
                
            </div>
        </div>
    )
} 

export default FormIban;