


export default function SaveError(){

return(
    <div style={
        {height:'100%',
        width:'100%',
        backgroundColor:'transparent',
        position:'relative',
        zIndex:'10000',
        transition:'ease-in'}}>
        <div style={
            {height:'35px',
            width:'150px',
            backgroundColor:'rgb(255,160,160)',
            padding:'3px',
            position:'absolute',
            top:'15px',
            left:'45%',
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            borderRadius:'8px',
            fontWeight:'bold'}}>
        Cannot save Flow
        </div>
        
    </div>
)


}