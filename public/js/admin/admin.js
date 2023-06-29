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
//categories
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

//prodcut
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


// Banners
function deleteBanner(id) {
  $.ajax({
    url: "/admin/banner_management",
    type: "delete",
    data: {
      bannerID: id,
    },
    success: (res) => {
      $("#allBanners").load(location.href + " #allBanners");
    },
  });
}


function changeActivity(id, active){
  $.ajax({
    url: "/admin/banner_management",
    type: "patch",
    data: {
      bannerID: id,
      currentActivity: active,
    },
    success: (res) => {
      $("#Action" + id).load(location.href + " #Action" + id);
    },
  });
}


// function changeActivity(id, active){

//   const options={
//     method:'PATCH',
//     headers:{
//       'Content-Type':'application/json',
//     },
//     body: JSON.stringify({bannerID: id,
//       currentActivity: active,})
//   }

//   fetch('http://localhost:3001/admin/banner_management',options)
//      .then(data=>{

//       console.log("jshjdhjh :" ,data);
//       $("#Action" + id).load(location.href + " #Action" + id);
//      }).catch(e=>{console.log(e)})
// }




$(function () {
var table=  $("#dataTable").DataTable({
    rowReorder: {
      selector: "td:nth-child(2)",
    },
    responsive: true,
    "bDestroy": true,
  });
  // new $.fn.dataTable.FixedHeader( table );
});
//orders
function deliverOrder(id, i) {
  $.ajax({
    url: "/admin/orders",
    type: "patch",
    data: {
      orderID: id,
    },
    success: (res) => {
      if (res.data.delivered === 1) {
        $("#deliver" + i).load(location.href + " #deliver" + i);
      }
    },
  });
}

function printInvoice(divName) {
  var printContents = document.getElementById(divName).innerHTML;
  var originalContents = document.body.innerHTML;

  document.body.innerHTML = printContents;

  window.print();

  document.body.innerHTML = originalContents;
}
