// هذا الكود سيتم تحميله وتنفيذه داخل الـ sandbox
// الهدف: قراءة محتوى ملف flag.txt وعرضه
fetch('/flag.txt')
  .then(response => response.text())
  .then(flag => {
    // عرض محتوى الـ Flag في نافذة منبثقة (alert)
    alert(flag);
  })
  .catch(error => {
    // في حالة وجود خطأ، أرسل رسالة للنافذة الرئيسية
    parent.postMessage('Failed to get flag: ' + error.message, '*');
  });
