// Customers
function changeAccess(id, access) {
    $.ajax({
      url: "/admin/customer_management",
      type: "patch",
      data: {
        userID: id,
        currentAccess: access,
      },
      success: (res) => {
        $("#" + id).load(location.href + " #" + id);
      },
    });
  }

  function deleteConfirmation(e,itemName) {
    e.preventDefault();
    const name=itemName

    var url = e.currentTarget.getAttribute('href')
    
    Swal.fire({
        icon: 'warning',
        title: "<h5 style=color='white'>"+`Are you sure you want delete ${name} ?`+"</h5>",
        text: 'This action cannot be undone!',
        background:'#19191a',
        iconColor:'red',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.value) {
            window.location.href=url;
        }
    })
}


function editConfirmation(e,itemName) {
  e.preventDefault();
  const name=itemName

  var url = e.currentTarget.getAttribute('href')
  
  Swal.fire({
      icon: 'question',
      title:"<h5 style=color='white'>"+ `You want to edit ${name} ?`+"</h5>",
      showCancelButton: true,
      background:'#19191a',
        iconColor:'blue',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
  }).then((result) => {
      if (result.value) {
          window.location.href=url;
      }
  })
}


function changeListing(e,itemName) {
  e.preventDefault();
  const name=itemName

  var url = e.currentTarget.getAttribute('href')
  
  Swal.fire({
      icon: 'question',
      title:"<h5 style=color='white'>"+ `Proceed to change listing of  ${name} ?`+"</h5>",
      showCancelButton: true,
      background:'#19191a',
        iconColor:'blue',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
  }).then((result) => {
      if (result.value) {
          window.location.href=url;
      }
  })
}

function editProduct(e,itemName) {
  e.preventDefault();
  const name=itemName

  var url = e.currentTarget.getAttribute('href')
  
  Swal.fire({
      icon: 'question',
      title:"<h5 style=color='white'>"+ `Proceed to edit  ${name} ?`+"</h5>",
      showCancelButton: true,
      background:'#19191a',
      iconColor:'blue',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
  }).then((result) => {
      if (result.value) {
          window.location.href=url;
      }
  })
}

