import { test } from '@playwright/test';
import MenuPage from '../pages/menu-page';
import ProfilePage from '../pages/profile-page';
import hooks from '../../utils/hooks';
import pages from '../../utils/pages';
import {
    BatchInfo,
    Configuration,
    EyesRunner,
    VisualGridRunner,
    BrowserType,
    DeviceName,
    ScreenOrientation,
    Eyes,
    Target
  } from '@applitools/eyes-playwright';

// Define which runner Applitools will use
export const USE_ULTRAFAST_GRID: boolean = true;
export let Batch: BatchInfo;
export let Config: Configuration;
export let Runner: EyesRunner;
let eyes: Eyes;
let profilePage: ProfilePage;
let menuPage: MenuPage;

// beforeAll for Applitools configuration and runner initialization
test.beforeAll(async() => {
    /**
     * Determine which runner to use
     * Ultrafast Grid
     * - All test execution will be managed by Applitools in the cloud
     * - Useful for running many browsers and devices in parallel
     * 
     * ClassicRunner
     * - Manage everything locally
     * - You must run every single browser or device in the local machine
     * - Time-consuming because you must download and install every single browser,
     * and manage parallelism locally
     */
    Runner = new VisualGridRunner({ testConcurrency: 5 }); // The free version of Applitools lets you run only one test
    const runnerName = 'Ultrafast Grid'; // Displays on Applitools Eyes dashboard

    /**
     * A batch is a collection of checkpoints for each test suite
     * - If we are using VisualGridRunner, we will have one batch for all the configurations since
     * Applitools manages everything for us
     * - If we are using ClassicRunner, each browser or device will be their own batch, since we
     * will start and trigger every single test locally
     */
    Batch = new BatchInfo({name: `Book Store - New Tab - ${runnerName}`});
    
    Config = new Configuration();
    
    Config.setBatch(Batch);
    // Add different viewports, screen orientations, browsers, devices
    Config.addBrowser(800, 600, BrowserType.CHROME);
    Config.addDeviceEmulation(DeviceName.iPhone_11, ScreenOrientation.PORTRAIT);
});


test.beforeEach(async ({page, context}) => {
    eyes = new Eyes(Runner, Config); // Create a new Eyes instance for each test
    await eyes.open(
      page,  // Driver
      'Book Store App', // App name
      test.info().title, // Test name
      { width: 1024, height: 768 } // View port
    );

    profilePage = await hooks.beforeEach(page, ProfilePage, pages.profile);
    menuPage = new MenuPage(page, context);
});

test.afterEach(async () => {
    await eyes.close(); // We must close the Eyes instance after each test to ensure the session is finished
});

test.afterAll(async() => {
  // Forces Playwright to wait synchronously for all visual checkpoints to complete
  const results = await Runner.getAllTestResults();
  console.log('Visual test results', results);
});

test.describe.skip('Visual Regression', () => {

    test('Profile Page and Swagger Page', async () => {
        await profilePage.checkLoggedIn();
        // Layout: Check only the layout and ignore actual text and graphics.
        // https://applitools.com/docs/api-ref/sdk-api/playwright/js-intro/checksettings#region-match-levels
        await eyes.check('Profile page', Target.window().fully().layout());

        await menuPage.openSwaggerAndCheck();
        await eyes.check('Swagger page', Target.window().fully());
    });
});