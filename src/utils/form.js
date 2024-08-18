export const preventDefaultEnterKey = (event) => {
   if (event.key === 'Enter') {
      event.preventDefault()
      return false
   }
}
