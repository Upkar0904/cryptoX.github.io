import React, { useEffect,useState } from 'react'
import axios from 'axios'
import { server } from '../index';
import { Button,Container, HStack, VStack, Image, Heading, Text, RadioGroup, Radio } from '@chakra-ui/react';
import Loader from './Loader';
import Error from './Error';
import Coincard from './Coincard';
const Coins = () => {
    const [Coins,setCoins]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError] = useState(false);
    const [page,setPage]=useState(1);
    const [currency,setCurrency]=useState("inr");
    const currencySymbol = currency==="inr"?"₹":currency==="eur"?"€":"$";
    const changePage = (page)=>{
        setPage(page);
        setLoading(true);
    }
    const btns = new Array(132).fill(1)
    useEffect(()=>{
        const fetchCoins=async()=>{
           try{
            const {data} = await axios.get(`${server}/coins/markets?vs_currency=${(currency)}&page=${page}`);
            setCoins(data);
            console.log(data);
            setLoading(false);
           } catch(error) {
            setError(true);
            setLoading(false);
           }
        };
        fetchCoins();
},[currency,page]);
if(error) return <Error message={"Error while fetching Coins"}/>;
  return (
    <Container maxW={"container.x1"}>
{loading ? (
    <Loader />
):(
    <>
    <RadioGroup value={currency} onChange={setCurrency}>
        <HStack spacing="4">
            <Radio value={"inr"}>₹</Radio>
            <Radio value={"usd"}>$</Radio>
            <Radio value={"eur"}>€</Radio>
        </HStack>
    </RadioGroup>


    <HStack wrap={"wrap"} justifyContent={'space-evenly'}>
        {Coins.map((i)=>(
            <Coincard
            id={i.id}
            key={i.id}
            name={i.name}
            price={i.current_price} 
            img={i.image}
            symbol={i.symbol}
            rank={i.trust_score_rank}
            url={i.url}
            currencySymbol={currencySymbol}
            />
        ))}
    </HStack>
    <HStack w={"full"} overflowX={"auto"} p={8}>
        {
            btns.map((item,index)=>(
                <Button 
                key={index}
                bgColor={"blackAlpha.900"} 
                color={"white"} onClick={()=>changePage(index+1)}>
                    {index+1}
                </Button>
            ))
        }
    </HStack>
    </>
)}
    </Container>
  )
};

export default Coins