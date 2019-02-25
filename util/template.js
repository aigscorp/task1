function templater(strings, ...keys) {
   return function(data) {
       let temp = strings.slice();
       keys.forEach((key, i) => {
           temp[i] = temp[i] + data[key];
       });
       return temp.join('');
   }
};

const template = templater`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <link rel="stylesheet" href="/css/bootstrap.min.css">
</head>
<style>
  .abc {
    padding-top: 150px;
  }
</style>
<body>
  <div class="container abc">
    <div class="row">
      <div class="col-md-12">  
      <form method="POST" action="/" name="shorten" id="urlshort">
        <div class="form-row ">
          <div class="col-md-8">
            <label class="sr-only" for="inlineFormInput">Name</label>
            <input type="text" class="form-control" id="inlineFormInput" name="url" value="">
          </div>
          <div class="col-md-2">
            <button type="submit" class="btn btn-primary">Short</button>
          </div>
        </div>
      </form>
      <a href="${'out'}" style="text-decoration:none;padding-top:10px;">Short Link - ${'out'}</a>  
      </div>
    </div>
  </div>  
</body>
</html>
`;

module.exports = template;




