Feature: Cinema ticket booking

  Scenario: User should be able to book standard seats for a movie session
    Given user selects movie "Ведьмак", hall "Современный зал" and session time "17:00"
    And goes to the "/client/hall.php" page
    When user selects standard seat
    And clicks button
    Then user sees the title "Вы выбрали билеты:"

  Scenario: User should be able to book VIP seats for a movie session
    Given user selects movie "Ведьмак", hall "Современный зал" and session time "17:00"
    And goes to the "/client/hall.php" page
    When user selects VIP-seat
    And clicks button
    Then booking is confirmed

  Scenario: User should not be able to book occupied seats
    Given user selects movie "Ведьмак", hall "Современный зал" and session time "17:00"
    And goes to the "/client/hall.php" page
    When user tries to select occupied seat
    Then the booking button is disabled
