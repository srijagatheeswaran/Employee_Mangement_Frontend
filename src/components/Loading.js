import { Hourglass } from 'react-loader-spinner'
import "./css/Loader.css"

function Loading() {
    return <>
        <div className='Loader_div'>
            <Hourglass
                visible={true}
                height="80"
                width="80"
                ariaLabel="hourglass-loading"
                wrapperStyle={{}}
                wrapperClass=""
                colors={['#306cce', '#72a1ed']}
            />
        </div>
    </>


}

export default Loading;