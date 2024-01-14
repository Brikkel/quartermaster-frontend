export function showDiv() {
    const informationBox = document.getElementById('informationBox');
    if (informationBox) {
      const currentDisplay = window.getComputedStyle(informationBox).display;
  
      // Toggle visibility
      informationBox.style.display = currentDisplay === 'none' ? 'block' : 'none';
    }

    // const frame = document.getElementById("informationBoxiframe");
    // var element = frame.contentWindow.document.getElementsByTagName("header")[0];
    // element.style.display = "none";
  }