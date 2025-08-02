import React, {useState} from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const CommonForm = ({ formControls, formData, setFormData, onSubmit, buttonText , isBtnDisabled}) => {

    function renderInputsByComponentType(controlItem) {
        let element = null;
        const value = formData[controlItem.name] || "";
        const [showPassword, setShowPassword] = useState(false);

        switch (controlItem.componentType) {
            case "input":
                if (controlItem.type === "password") {
                    element = (
                        <div className="relative">
                            <Input
                                name={controlItem.name}
                                placeholder={controlItem.placeholder}
                                id={controlItem.name}
                                type={showPassword ? "text" : "password"}
                                value={value}
                                onChange={(e) => {
                                    setFormData((prevState) => ({
                                        ...prevState,
                                        [controlItem.name]: e.target.value
                                    }))
                                }}
                            />
                            <div className='absolute right-0 top-3 flex items-center justify-center cursor-pointer pr-3' onClick={()=> setShowPassword(!showPassword)}>
                                {showPassword ? (
                                    <FaEyeSlash className="h-4 w-4" />
                                ) : (
                                    <FaEye className="h-4 w-4" />
                                )}
                            </div>
                        </div>
                    );
                }
                else{
                element = <Input
                    name ={controlItem.name}
                    placeholder = {controlItem.placeholder}
                    id = {controlItem.name}
                    type = {controlItem.type}
                    value = {value}
                    onChange = {(e) =>{
                        setFormData((prevState) => ({
                            ...prevState,
                            [controlItem.name]: e.target.value
                        }))
                    }}
                />}
                
                break;

            case "select":
                    element = <Select onValueChange={(value)=>{
                        setFormData((prevState)=> ({
                            ...prevState,
                            [controlItem.name]: value,
                        }))
                        }
                    } value={value}>
                        <SelectTrigger className="w-32 cursor-pointer" >
                            <SelectValue  placeholder ={controlItem.label} />
                        </SelectTrigger>
                        <SelectContent >
                            {
                                controlItem.options && controlItem.options.length >0 ?
                                controlItem.options.map((optionItem)=>{
                                    return (
                                        <SelectItem className="cursor-pointer" key={optionItem.id} value={optionItem.id}>{optionItem.label}</SelectItem>
                                    )
                                }) : null
                            }
                        </SelectContent>
                    </Select>
                    break;

                    case "textarea":
                        element = <Textarea
                        name ={controlItem.name}
                        placeholder = {controlItem.placeholder}
                        id = {controlItem.name}
                        value = {value}
                        onChange = {(e) =>{
                            setFormData((prevState) => ({
                                ...prevState,
                                [controlItem.name]: e.target.value
                            }))
                        }}
                        />
                        break;
        
            default:
                element = <Input
                    name ={controlItem.name}
                    placeholder = {controlItem.placeholder}
                    id = {controlItem.name}
                    type = {controlItem.type}
                    value = {value}
                    onChange = {(e) =>{
                        setFormData((prevState) => ({
                            ...prevState,
                            [controlItem.name]: e.target.value
                        }))
                    }}
                />
                break;
        }

        return element;
    }
    return (
        <form onSubmit={onSubmit} >
            <div className='flex flex-col gap-3'>
                {
                    formControls.map((controlItem) => {
                        return (
                            <div className='grid w-full gap-1.5' key={controlItem.name}>
                                <Label className="mb-1 font-semibold">{controlItem.label}</Label>
                                {
                                    renderInputsByComponentType(controlItem)
                                } 
                            </div>
                        )
                    })
                }
            </div>
            <Button disabled={isBtnDisabled} type="submit" className="w-full mt-7 cursor-pointer">{buttonText || "Submit"}</Button>
        </form>
    )
}

export default CommonForm