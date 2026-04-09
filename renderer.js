const { stat } = require("original-fs");

window.addEventListener('DOMContentLoaded', async () => {
    const textarea = document.getElementById('note');
    const saveBtn = document.getElementById('save');
    const statusEl=document.getElementById('save_status');
    const saveAsBtn=document.getElementById('save-as');

   
    const savedNote = await window.electronAPI.loadNote();
    textarea.value = savedNote;
    let lastSavedText=textarea.value;

    // Manual save
    saveBtn.addEventListener('click', async () => {
        try {
            await window.electronAPI.saveNote(textarea.value);
            alert('Note saved successfully!');            
        } catch (err) {
            console.error('Manual save failed:', err);            
        }
    });
    
    async function autoSave(){
        const currentText=textarea.value;
        if(currentText==lastSavedText){
            statusEl.textContent='No changes to save';
            return;
        }
        try{
            await window.electronAPI.saveNote(currentText);
            lastSavedText=currentText;
            const now=new Date().toLocaleTimeString();
            statusEl.textContent=`Auto saved at ${now}`;
        }catch(err){
            console.error('Auto-save failed:',err);
            statusEl.textContent='Auto-save Error!';
        }

    }
    let debounceTimer;
    textarea.addEventListener('input',()=>{
        statusEl.textContent='.Changes detected - auto-saving in 5s...';
        clearTimeout(debounceTimer);
        debounceTimer=setTimeout(autoSave,5000);
    });
    saveAsBtn.addEventListener('click',async()=>{
        const result=await window.electronAPI.saveAs(textarea.value);
        if(result.success){
            lastSavedText=textarea.value;
            statusEl.textContent=`Saved as ${result.filepath}`;
        }else{
            statusEl.textContent='Save As cancelled';
        }
    });
});