type EncodedImageProps = {
    encodedString: string
}

function EncodedImage({ encodedString }: EncodedImageProps) {
    const modifiedEncodedString = `data:image/jpg;base64,${encodedString}`
    
    return (
        <img src={modifiedEncodedString} alt="class preview"/>
    )
}

export default EncodedImage
