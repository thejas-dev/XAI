import {motion} from 'framer-motion';



export default function Header() {
	// body...


	return (

		<motion.div 
		initial={{
			opacity:0
		}}
		whileInView={{
			opacity:1	
		}}
		transition={{
			duration:3
		}}
		className="absolute py-3 px-5 gap-5 flex justify-center items-center top-[50%] w-full" >
			<motion.h1 
			initial={{
				opacity:0
			}}
			whileInView={{
				opacity:[1,0.6]
			}}
			transition={{
				duration:5
			}}

			className="text-xl text-gray-300 opacity-60 tracking-[7px]">XAI - OPENAI</motion.h1>


		</motion.div>

	)
}