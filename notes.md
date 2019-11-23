
## Convolution Filters separability
    Convolution matrices sometimes have a property that makes them separable.
    Being separable means if you have a n x n matrix, <i>A</i> then <i>A</i> can be split 
    into a <i>1 x n</i> row vector, <i>B</i> and a <i>n x 1</i> column vector, <i>C</i>.
    These vectors multiplied together recreate <i>A</i>.

## Convolution filters and image edges

    The diagram shows a problem with convolution filters. Sometimes the filter,
    at the edges, goes beyond the border of the image. If your image is represented
    by an array, then trying to access outside of the image would be an out of bounds
    access, which should crash the program. There are a few ways to deal with filters
    at the edges of images. One would be to create a clone of the image with the border
    extended to accomodate the filter size. This would be slow and impractical. Another 
    choice is to wrap the filter around the image. So if the filter passes the top border
    of the image then the part that doesn't overlap will overlap the bottom of the image.  
    Besides that, one can take the pixels at the border and use those as the pixel value
    whenever exceeding the border. You can also ignore the boundaries which will shrink the 
    image, but that probably isn't correct for most applications.
