import profile from './assets/profile.jpg'
export default function App() {
	return (
		<div>
			<div className='h-12 bg-[#366889]'>
				<div className='pt-3 pr-2 text-right'>
					<a
						href='#'
						className='rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white'>
						About
					</a>
					<a
						href='#'
						className='rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white'>
						Blog
					</a>
					<a
						href='#'
						className='rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white'>
						Projects
					</a>
				</div>
			</div>
			<div className='flex justify-center h-96 bg-[#153148]'>
				<div className='flex place-items-center'>
					<div className='flex'>
						<div className='w-80 h-80 relative overflow-hidden rounded-full'>
							<img
								className='scale-110 ml-[-12px] mt-2'
								src={profile}
								alt='profile'
							/>
						</div>
						<div className='ml-8 text-white'>
							<label className='text-5xl'>Mike McEnery</label>
							<br />
							<label className='italic'>Quality Software Delivered</label>
							<br />
							<div className='mt-8 italic w-[600px] text-white'>
								Senior software engineer with 16 years of experience in full
								stack development with a history of delivering high quality
								applications through great teamwork and communication. Expertise
								includes improving system architecture, improving team
								effectiveness and exceeding users expectations.
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
