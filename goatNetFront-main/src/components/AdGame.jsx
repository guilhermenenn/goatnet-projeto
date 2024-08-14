const AdGame = (props) => {
    return (
            <button onClick={props.onClick} className='border-2 bg-slate-800 rounded-md border-slate-500 h-96 hover:text-slate-400 transition'>
                <img src={props.data.images[0]} alt="img1" className='rounded-md h-5/6 w-full' />
                <a className='text-[22px]'>{props.data.name}</a>
                <p className='text-[22px]'>R${props.data.price}</p>
            </button>
    )
}

export default AdGame;