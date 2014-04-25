Building-Mapper
===============

## Testing
We are using [mocha](http://visionmedia.github.io/mocha/) to test our code.
Check out the website for installation details.

To run all tests:

    $ mocha

## SQL Models
Make sure you have a folder called tmp in the project directory (ignored by gitignore)

To create the database schema & tables, run the following:

    >>> from app import db
    >>> db.create_all()
