import { HttpMethod } from '@/models/rest-client';

interface CodeTemplateParams {
  method: HttpMethod;
  url: string;
  headers: Array<{ key: string; value: string }>;
  body?: string;
}

export const codeTemplates = {
  curl: ({ method, url, headers, body }: CodeTemplateParams): string => {
    const headerLines = headers
      .map(({ key, value }) => `  -H "${key}: ${value}"`)
      .join(' \\\n');
    const bodyLine = body ? ` \\\n  -d '${body}'` : '';
    return `curl -X ${method} "${url}" \\\n${headerLines}${bodyLine}`;
  },

  javascript: ({ method, url, headers, body }: CodeTemplateParams): string => {
    const headerLines = headers
      .map(({ key, value }) => `    "${key}": "${value}"`)
      .join(',\n');
    return `fetch("${url}", {
  method: "${method}",
  headers: {
${headerLines}
  },
  body: ${body ? body : 'null'}
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));`;
  },

  xhr: ({ method, url, headers, body }: CodeTemplateParams): string => {
    const headerLines = headers
      .map(({ key, value }) => `xhr.setRequestHeader("${key}", "${value}");`)
      .join('\n');
    return `const xhr = new XMLHttpRequest();
xhr.open("${method}", "${url}");
${headerLines}
xhr.onload = function() {
  if (xhr.status === 200) {
    console.log(JSON.parse(xhr.responseText));
  } else {
    console.error(xhr.statusText);
  }
};
xhr.onerror = function() {
  console.error(xhr.statusText);
};
${body ? `xhr.send(${body});` : 'xhr.send();'}`;
  },

  nodejs: ({ method, url, headers, body }: CodeTemplateParams): string => {
    const headerLines = headers
      .map(({ key, value }) => `    "${key}": "${value}"`)
      .join(',\n');
    return `const https = require('https');

const options = {
  method: '${method}',
  headers: {
${headerLines}
  }
};

const req = https.request("${url}", options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(JSON.parse(data));
  });
});

req.on('error', (error) => {
  console.error(error);
});

${body ? `req.write(${body});` : ''}
req.end();`;
  },

  python: ({ method, url, headers, body }: CodeTemplateParams): string => {
    const headerLines = headers
      .map(({ key, value }) => `    "${key}": "${value}"`)
      .join(',\n');
    return `import requests

headers = {
${headerLines}
}

response = requests.${method.toLowerCase()}("${url}", headers=headers${body ? `, json=${body}` : ''})
print(response.json())`;
  },

  java: ({ method, url, headers, body }: CodeTemplateParams): string => {
    const headerLines = headers
      .map(
        ({ key, value }) =>
          `        requestBuilder.header("${key}", "${value}");`
      )
      .join('\n');
    return `import java.net.http.*;
import java.net.URI;
import java.net.http.HttpRequest.BodyPublishers;
import java.net.http.HttpResponse.BodyHandlers;

public class Main {
  public static void main(String[] args) throws Exception {
    HttpClient client = HttpClient.newHttpClient();
    
    HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
      .uri(URI.create("${url}"))
      .method("${method}", ${body ? `BodyPublishers.ofString(${body})` : 'BodyPublishers.noBody()'});
      
${headerLines}
    
    HttpResponse<String> response = client.send(requestBuilder.build(), BodyHandlers.ofString());
    System.out.println(response.body());
  }
}`;
  },

  csharp: ({ method, url, headers, body }: CodeTemplateParams): string => {
    const headerLines = headers
      .map(
        ({ key, value }) =>
          `        client.DefaultRequestHeaders.Add("${key}", "${value}");`
      )
      .join('\n');
    return `using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

class Program {
  static async Task Main() {
    using var client = new HttpClient();
${headerLines}
    
    var response = await client.${method.toLowerCase()}Async("${url}"${body ? `, new StringContent(${body}, Encoding.UTF8, "application/json")` : ''});
    Console.WriteLine(await response.Content.ReadAsStringAsync());
  }
}`;
  },

  go: ({ method, url, headers, body }: CodeTemplateParams): string => {
    const headerLines = headers
      .map(({ key, value }) => `    req.Header.Add("${key}", "${value}")`)
      .join('\n');
    return `package main

import (
  "fmt"
  "io/ioutil"
  "net/http"
  "strings"
)

func main() {
  client := &http.Client{}
  
  req, _ := http.NewRequest("${method}", "${url}", ${body ? `strings.NewReader(${body})` : 'nil'})
${headerLines}
  
  resp, err := client.Do(req)
  if err != nil {
    fmt.Println(err)
    return
  }
  defer resp.Body.Close()
  
  body, _ := ioutil.ReadAll(resp.Body)
  fmt.Println(string(body))
}`;
  },
};
