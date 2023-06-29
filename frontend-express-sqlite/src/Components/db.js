export const saveTaskIdsToDB = (taskIds) => {
    const data = JSON.stringify(taskIds);
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(data);
    link.download = 'taskIds.json';
    link.click();
  };
  