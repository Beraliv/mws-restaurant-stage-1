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

#### Stage 1

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

#### Stage 2 (using Lighthouse report)

- [x] Performance
  - [x] `> 70` (increased to average `93`)
- [x] Progressive Web Application
  - [x] `> 90` (increased from `73` to `92`)
- [x] Accessibility
  - [x] `> 90` (increased from `81` to `95`)

#### Stage 3 (using Lighthouse report)

- [x] A form to allow users to create their own reviews
- [ ] A functionality to defer updates until the user is connected
- [ ] Performance
  - [ ] `> 90` (decreased to `72` and `74` for home and restaurant pages)
- [x] Progressive Web Application
  - [x] `> 90` (from previous stage: `92`)
- [x] Accessibility
  - [x] `> 90` (from previous stage: `92`)

### Reports

![Home page](https://github.com/Beraliv/mws-restaurant-stage-1/blob/master/report/home-page-report.png)

![Restaurant page](https://github.com/Beraliv/mws-restaurant-stage-1/blob/master/report/restaurant-page-report.png)

### Image

<div>PNG picture is extracted from <a href="https://the-avocado.org/" title="The Avocado">The Avocado</a>
