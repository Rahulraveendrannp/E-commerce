
function filter(filterBy){
    $.ajax({
        
        url:"/products",
        type:"patch",
        data:{
            filterBy:filterBy
        },
        success:(res)=>{
            if(res.success == "clear"){
                $("#listingpage").load(location.href + " #listingpage");
                $("#searchInput").val("");
            }else{
            Swal.fire({
                toast: true,
                icon: "success",
                position: "top-right",
                showConfirmButton: false,
                timer: 1000,
                animation: true,
                title: "Filtered",
              });
              $("#listingpage").load(location.href + " #listingpage");
              
              if (res.success == 0) {
                $("#searchInput").val("");
              }}
        }
    })

}

function sortBy(order) {
    $.ajax({
      url: "/products",
      method: "post",
      data: { sortBy: order },
      success: (res) => {
        if (res.sorted == '1') {    
          Swal.fire({
            toast: true,
            icon: "success",
            position: "top-right",
            showConfirmButton: false,
            timer: 1000,
            animation: true,
            title: "Sorted",
          });
          $("#listingpage").load(location.href + " #listingpage");
        }
      },
    });
  }

function search(){
    var searchInput=$("#searchInput").val();
    if (searchInput) {
        $("#searchButton").html(
          `<button class="btn btn-sm" onclick="filter('none')" >Remove Filter</button>`
        );
      }
      $.ajax({
        url: "/products",
        method: "put",
        data: { searchInput: searchInput },
        success: (res) => {
          console.log("fgfg"+res);
          $("#productContainer").load(location.href + " #productContainer");
        },
      });
}

// function removeFilter(filterBy) {

//     $.ajax({
//         url:"/products",
//         type:"patch",
//         data:{
//             filterBy:filterBy
//         },
//         success:(res)=>{
//             $("#productContainer").load(location.href + " #productContainer");
//         }
//     })
// }