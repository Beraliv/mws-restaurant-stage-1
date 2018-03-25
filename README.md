# Mobile Web Specialist Certification Course

#### _Three Stage Course Material Project - Restaurant Reviews_

## Project Overview: Stage 1

For the **Restaurant Reviews** projects, I incrementally convert a static webpage to a mobile-ready web application. In **Stage One**, I take a static design that lacks accessibility and convert the design to be responsive on different sized displays and accessible for screen reader use. I will also add a service worker to begin the process of creating a seamless offline experience for your users.

### Quick start

Check your python version

```bash
python -V
```

If you don't have Python installed, navigate to Python's [website](https://www.python.org/) to download and install the software.

If you have Python 2.x, spin up the server with:

```bash
python run2.py
```

For Python 3.x, you can use:

```
python3 run3.py
```

With your server running, visit the site: [http://localhost:8000](http://localhost:8000).

### Issues

- [x] Responsive Design
  - [x] Two white columns are replaced with background colour (laptop)
  - [x] Grid of restaurants is well centered
  - [x] Horizontal scroll (mobile)
  - [x] All the space is covered with elements (laptop)
- [x] Accessibility
  - [x] Images has `alt` attribute
  - [x] All headers have appropriate `aria` roles
  - [x] Google Map has `application` or `widget` role
  - [x] Table has `tabindex` to enable a user to go it through using Tab
  - [x] Breadcrumbs have appropriate `aria` roles, structure and attributes (based on [W3 Breadcrumb Example](https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/breadcrumb/index.html))
  - [x] Language is set to `html` as attribute `lang="en"`
  - [x] Main has a `main` role
- [x] Offline Availability
  - [x] Service worker is registered
  - [x] Service worker implements offline caching (in case of network failure)
- [x] General improvements
  - [x] JS style is set (using [ESLint](https://eslint.org/) based on [Udacity style guide](http://udacity.github.io/frontend-nanodegree-styleguide/javascript.html))
  - [x] CSS style is set (using [Style lint](https://stylelint.io/) based on [Udacity style guide](http://udacity.github.io/frontend-nanodegree-styleguide/css.html))
  - [x] Structure README (using [Udacity: Writing READMEs](https://classroom.udacity.com/courses/ud777))

### License

<div>Icon made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
