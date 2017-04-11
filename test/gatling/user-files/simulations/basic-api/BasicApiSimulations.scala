/**
 * Copyright 2011-2017 GatlingCorp (http://gatling.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package computerdatabase.advanced

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import scala.concurrent.duration._
import java.util.concurrent.ThreadLocalRandom

class BasicApiSimulations extends Simulation {

  val xFormHeader = Map("Content-Type" -> "application/x-www-form-urlencoded")

  object Login {
    val login = tryMax(2) { // let's try at max 2 times
      exec(http("login")
        .post("/users/login")
        .headers(xFormHeader)
        .formParam("username", "hatu")
        .formParam("password", "hatu")
        check(status.is(session => 200 + ThreadLocalRandom.current.nextInt(2)))) // we do a check on a condition that's been customized with a lambda. It will be evaluated every time a user executes the request
    }.exitHereIfFailed
  }

  object Images {
    val images = tryMax(2) { // let's try at max 2 times
      exec(http("Images")
        .get("/api/images")
        .check(status.is(session => 200 + ThreadLocalRandom.current.nextInt(2)))) // we do a check on a condition that's been customized with a lambda. It will be evaluated every time a user executes the request
    }.exitHereIfFailed //Images
  }

  object Swcs {
    val swcs = tryMax(2) { // let's try at max 2 times
      exec(http("Swcs")
        .get("/api/swcs/slice15")
        .check(status.is(session => 200 + ThreadLocalRandom.current.nextInt(2)))) // we do a check on a condition that's been customized with a lambda. It will be evaluated every time a user executes the request
    }.exitHereIfFailed // if the chain didn't finally succeed, have the user exit the whole scenario
  }

  object SwcContent {
    val swcContent = tryMax(2) { // let's try at max 2 times
      exec(http("SwcContent")
        .get("/dvid/swc/key/slice15_L11.swc")
        .check(status.is(session => 200 + ThreadLocalRandom.current.nextInt(2)))) // we do a check on a condition that's been customized with a lambda. It will be evaluated every time a user executes the request
    }.exitHereIfFailed // if the chain didn't finally succeed, have the user exit the whole scenario
  }

  val httpConf = http
    .baseURL("http://localhost:2222")
    .acceptHeader("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
    .doNotTrackHeader("1")
    .acceptLanguageHeader("en-US,en;q=0.5")
    .acceptEncodingHeader("gzip, deflate")
    .userAgentHeader("Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:16.0) Gecko/20100101 Firefox/16.0")

  val scn = scenario("BasicApiSimulations").exec(Login.login, Images.images, Swcs.swcs, SwcContent.swcContent)
  setUp(scn.inject(atOnceUsers(1)).protocols(httpConf))
}
