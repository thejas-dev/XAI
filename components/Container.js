import {motion} from 'framer-motion'
import {useState,useEffect,useRef} from 'react'
const { Configuration, OpenAIApi } = require("openai");
import {AiOutlineSend} from 'react-icons/ai'
import {HiUserCircle} from 'react-icons/hi';


export default function Container() {
	const [userPrompt,setUserPrompt] = useState('');
	const [chatArray,setChatArray] = useState([]);
	const scrollRef = useRef();
	const [uniqueIdPublic,setUniqueIdPublic] = useState('');

	const configuration = new Configuration({
	  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
	});
	const openai = new OpenAIApi(configuration);
	let loadInterval;

	const generateUniqueId = () =>{
		const random = Math.random();
		const time = Date.now();
		const hexa = random.toString(16);


		return `id-${time}-${hexa}`
	}

	useEffect(()=>{
		scrollRef.current?.scrollIntoView({behaviour:"smooth"});
	},[chatArray]);

	useEffect(()=>{
		const form =document.querySelector('#form');
		form.addEventListener('keyup',(e)=>{
			if(e.keyCode === 13){
				handleSubmit(e);
			}
		})
		if(localStorage.getItem('xai')){
			let newArr=[];
			const data = JSON.parse(localStorage.getItem('XAI'))
			data.map((da)=>{
				if(da.user){
					newArr.push(da)
				}
			})
			setChatArray(newArr)
			// console.log(JSON.parse(localStorage.getItem('XAI')));
		}
	},[]);

	const typeMessage = (element,text) =>{
		let index=0;
		const chatContainer =document.getElementById('chat_container');
		const interval = setInterval(()=>{
			if(index<text.length){
				element.innerHTML += text.charAt(index);
				scrollRef.current?.scrollIntoView({behaviour:"smooth"});
				// chatContainer.scrollTop = chatContainer.scrollHeight;
				index++;
			}else{
				clearInterval(interval);
			}
		},20)
		
	}


	function Loader (element) {
		element.textContent=". ";
		const chatContainer =document.getElementById('chat_container');
		chatContainer.scrollTop = chatContainer.scrollHeight;
		loadInterval = setInterval(()=>{
			if(element.textContent.charAt(0) !== "." ){
				clearInterval(loadInterval)
			}else{
				element.textContent += ". ";

				if(element.textContent === ". . . . . " ){
					element.textContent = ". ";
				}				
			}
		},300)
	}
 
	const communicate = async(requestText) =>{
		const response = await openai.createCompletion({
		  model: "text-davinci-003",
		  prompt: requestText,
		  temperature: 0,
		  max_tokens: 4000,
		  top_p: 1,
		  frequency_penalty: 0.5,
		  presence_penalty: 0,
		});
		return response;
	}

	useEffect(()=>{
		if(uniqueIdPublic){
			const messageDiv = document.getElementById(uniqueIdPublic);
			setUniqueIdPublic('')
			Loader(messageDiv);				
		}
	},[uniqueIdPublic])

	const handlePrompt = async(text) =>{
		if(text.length >2){
			const chatContainer =document.getElementById('chat_container');

			const userDetails = {
				user:true,
				message:text
			}
			setChatArray(chatArray=>[...chatArray,userDetails]);
			setUserPrompt('')

			const uniqueId = generateUniqueId();
			const aiDetails = {
				user:false,
				message:" ",
				uniqueId:uniqueId
			}
			chatContainer.scrollTop = chatContainer.scrollHeight;
			setUniqueIdPublic(uniqueId);
			setChatArray(chatArray=>[...chatArray,aiDetails]);
			try{
				const response = await communicate(text);
				clearInterval(loadInterval);
				const messageDiv = document.getElementById(uniqueId);
				messageDiv.textContent = "";

				const parsedData = response.data.choices[0].text.trim();
				
				typeMessage(messageDiv,parsedData);
			}catch(err){
				clearInterval(loadInterval);
				const messageDiv = document.getElementById(uniqueId);
				messageDiv.textContent = "";

				const parsedData = "Something Went Wrong....";

				typeMessage(messageDiv,parsedData);
			}			
		}else{
			setUserPrompt('')
		}

	}


	useEffect(()=>{
		localStorage.setItem('XAI',JSON.stringify(chatArray));
		const chatContainer =document.getElementById('chat_container');
		chatContainer.scrollTop = chatContainer.scrollHeight;
	},[chatArray])

	const handleSubmit = (e,text) =>{

		e.preventDefault();
		handlePrompt(e.target.value || text);
	}

	// const chatStripe=(isUser, value, uniqueId)=>{
	// 	// if(isUser){
	// 		return (
	// 			`
	// 			<div className="chat mt-4 w-full bg-[#40414F]/10 flex p-[15px] rounded-xl gap-2">
	// 				<HiUserCircle className="h-12 w-12 text-blue-600"/>
	// 				<div className="message text-[#dcdcdc] max-w-[100%] overflow-x-scroll no-scrollbar whitespace-pre-wrap">${value}</div>
	// 			</div>
	// 			`
	// 		)
	// 	// }else{
	// 	// 	return (
	// 	// 		`
	// 	// 		<div className="chat mt-2 w-full bg-[#40414F] flex p-[15px] rounded-xl gap-2">
	// 	// 			<img src="https://ik.imagekit.io/d3kzbpbila/openai-avatar_voSAMj2xG.png?ik-sdk-version=javascript-1.4.3&updatedAt=1671876198941"
	// 	// 			alt=""
	// 	// 			className="h-9 w-9 rounded-full"
	// 	// 			/>
	// 	// 			<div className="message text-[#dcdcdc] max-w-[100%] overflow-x-scroll no-scrollbar whitespace-pre-wrap" 
	// 	// 			id=${uniqueId}>${value}</div>
	// 	// 		</div>
	// 	// 		`
	// 	// 	)
	// 	// }
	// }


	return (
		<motion.div
		className="w-full h-screen md:px-0 px-3 flex flex-col items-center justify-between"
		>
		<div 
		id="chat_container"
		className="chat-container h-full scroll-smooth flex flex-col w-full overflow-y-scroll no-scrollbar p-[2px]">
			{
				chatArray.map((chat,i)=>(
					chat?.user ? 
						<div 
						key={i}
						ref={scrollRef}
						className="chat w-full bg-[#40414F]/50 flex p-[15px] rounded-xl md:gap-4 gap-2 items-center  ">
								<HiUserCircle className="h-10 w-10 text-blue-600"/>
								<div className="message text-[#dcdcdc] max-w-[100%] overflow-x-scroll no-scrollbar whitespace-pre-wrap" >{chat.message}</div>
						</div>

					:
						<div 
						key={chat.uniqueId}
						className="chat mb-2 mt-2 w-full bg-[#40414F]/80 flex p-[15px] rounded-xl gap-2">
							<img src="https://ik.imagekit.io/d3kzbpbila/openai-avatar_voSAMj2xG.png?ik-sdk-version=javascript-1.4.3&updatedAt=1671876198941"
							alt=""
							className="h-9 w-9 rounded-full"
							/>
							<div className="message text-[#dcdcdc] max-w-[100%] overflow-x-scroll no-scrollbar whitespace-pre-wrap"
							id={chat.uniqueId}
							ref={scrollRef}
							>{chat.message}</div>
						</div>


				))
			}	

		</div>

		<form
		id="form"
		onSubmit={(e)=>handleSubmit(e,userPrompt)}
		 className="w-full md:mb-2 mb-5 p-[10px] bg-gray-900/70 rounded-2xl flex items-center gap-2">
			<textarea name="prompt" 
			value={userPrompt}
			onChange={(e)=>setUserPrompt(e.target.value)}
			rows="1" cols="1" placeholder="Ask anything..."
			className="w-full color-[#fff] text-[#fff] text-md p-[10px] bg-transparent rounded-md border-0 outline-none"
			/>
			<button type="submit">
			<AiOutlineSend className="h-7 w-7 text-gray-300 hover:text-sky-500 transition duration-300 ease-out" />
			</button>
		</form>


		</motion.div>

	)
}


